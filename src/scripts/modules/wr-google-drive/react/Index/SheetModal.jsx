import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
// import {Modal, OverlayTrigger, Tooltip, TabbedArea, TabPane} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
// import Select from '../../../../react/common/Select';
import SapiTableSelector from '../../../components/react/components/SapiTableSelector';

// const SHEET_TITLE_HELP = 'Sheet title';

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
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.localState(['currentSheet', 'title'], false) ? 'Edit' : 'Add'} Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row form-horizontal clearfix">
            {this.renderTableSelector()}
            {/* {this.renderInput('Title', 'title', TITLE_HELP, placeholders.title)} */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.isSavingFn(this.sheet('id'))}
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            placement="right"
            saveLabel="Add Table"
            isDisabled={this.isSavingDisabled()}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  renderTableSelector() {
    return (
      <SapiTableSelector
        onSelectTableFn={this.onSelectTable}
        placeholder="Select..."
        value={this.sheet(['tableId'], '')}
        allowCreate={false}
      />
    );
  },

  renderInput(caption, propertyPath, helpText, placeholder, validationFn = () => null) {
    const validationText = validationFn();
    const inputControl = this.renderInputControl(propertyPath, placeholder);
    return this.renderFormControl(caption, inputControl, helpText, validationText);
  },

  onSelectTable(value) {
    this.updateLocalState(['sheet', 'tableId'], value);
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
