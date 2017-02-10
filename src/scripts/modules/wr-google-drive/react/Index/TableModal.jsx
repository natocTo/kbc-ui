import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
// import {Modal, OverlayTrigger, Tooltip, TabbedArea, TabPane} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
// import Select from '../../../../react/common/Select';
import SapiTableSelector from '../../../components/react/components/SapiTableSelector';

const HELP_INPUT_TABLE = 'Select source table from Storage';
const HELP_SHEET_TITLE = 'Name of the sheet';
const HELP_SHEET_SPREADSHEET = 'Parent spreadsheet';

export default React.createClass({
  propTypes: {
    // placeholders: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    isSavingFn: PropTypes.func.isRequired,
    onHideFn: PropTypes.func,
    onSaveFn: PropTypes.func.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired
  },

  render() {
    const type = this.localState(['sheet', 'type']);
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.localState(['currentSheet', 'title'], false) ? 'Edit' : 'Add'} {type}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            {this.renderTableSelector()}
            {(type === 'sheet') ? this.renderSheetFields() : this.renderFileFileds()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.isSavingFn(this.sheet('id'))}
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            placement="right"
            saveLabel="Save"
            isDisabled={this.isSavingDisabled()}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  renderSheetFields() {
    const title = this.renderInput('Title', 'title', HELP_SHEET_TITLE, 'My Sheet');
    const spreadsheet = this.renderInput('Spreadsheet', 'fileId', HELP_SHEET_SPREADSHEET, 'My Sheet');

    return (
      <div>
        {title}
        {spreadsheet}
      </div>
    );
  },

  renderFileFileds() {

  },

  renderTableSelector() {
    const element = (
      <SapiTableSelector
        onSelectTableFn={(value) => this.updateLocalState(['sheet', 'tableId'], value)}
        placeholder="Select..."
        value={this.sheet(['tableId'], '')}
        allowCreate={false}
      />
    );
    return this.renderFormElement('Input table', element, HELP_INPUT_TABLE);
  },

  renderInput(caption, propertyPath, helpText, placeholder, validationFn = () => null) {
    const validationText = validationFn();
    const inputElement = this.renderInputElement(propertyPath, placeholder);
    return this.renderFormElement(caption, inputElement, helpText, validationText);
  },

  renderInputElement(propertyPath, placeholder) {
    return (
      <input
        placeholder={placeholder}
        type="text"
        value={this.sheet(propertyPath)}
        onChange={(e) => this.updateLocalState(['sheet'].concat(propertyPath), e.target.value)}
        className="form-control"
      />
    );
  },

  renderFormElement(label, element, helpText, errorMsg) {
    return (
      <div className={errorMsg ? 'form-group has-error' : 'form-group'}>
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          {element}
          <span className="help-block">
            {errorMsg || helpText}
          </span>
        </div>
      </div>
    );
  },

  isSavingDisabled() {
    const hasChanged = !this.sheet(null, Map()).equals(this.localState('currentSheet'));
    const nameEmpty = !!this.sheet(['title']);
    return !hasChanged || !nameEmpty;
  },

  localState(path, defaultVal) {
    return this.props.localState.getIn([].concat(path), defaultVal);
  },

  sheet(path, defaultValue) {
    if (path) {
      return this.localState(['sheet'].concat(path), defaultValue);
    } else {
      return this.localState(['sheet'], defaultValue);
    }
  },

  updateLocalState(path, newValue) {
    return this.props.updateLocalState([].concat(path), newValue);
  },

  handleSave() {
    this.props.onSaveFn(this.sheet()).then(
      () => this.props.onHideFn());
  }
});
