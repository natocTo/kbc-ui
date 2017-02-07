import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import {Modal, OverlayTrigger, Tooltip, TabbedArea, TabPane} from 'react-bootstrap';
import Select from '../../../../react/common/Select';

export default React.createClass({
  propTypes: {
    placeholders: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    isSavingFn: PropTypes.func.isRequired,
    onHideFn: PropTypes.func,
    onSaveFn: PropTypes.func.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired
  },

  render() {
    const placeholders = this.props.placeholders || {};
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.localState(['currentSheet', 'title'], false) ? 'Edit' : 'New'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

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

  nameInvalidReason() {
    const name = this.query('name');
    if (name && !(/^[a-zA-Z0-9-_]+$/.test(name))) return 'Can only contain alphanumeric characters, underscore and dot.';
    return null;
  },

  isSavingDisabled() {
    const queryHasChanged = !this.query(null, Map()).equals(this.localState('currentQuery'));
    const fieldsValid = !!this.query(['query', 'fields']);
    const nameEmpty = !!this.query(['name']);
    const limitEmpty = !!this.query(['query', 'limit']);
    return !queryHasChanged || !fieldsValid || !nameEmpty || !limitEmpty || this.nameInvalidReason();
  },

  renderFieldsInput(placeholder) {
    const control = (<textarea
      placeholder={placeholder}
      value={this.query(['query', 'fields'])}
      onChange={(e) => this.updateLocalState(['query', 'query', 'fields'], e.target.value)}
      className="form-control" rows="2" required/>);
    return this.renderFormControl('Fields', control, FIELDS_HELP);
  },

  renderInputControl(propertyPath, placeholder) {
    return (
      <input
        placeholder={placeholder}
        type="text"
        value={this.query(propertyPath)}
        onChange={(e) => this.updateLocalState(['query'].concat(propertyPath), e.target.value)}
        className="form-control"
      />
    );
  },

  renderInput(caption, propertyPath, helpText, placeholder, validationFn = () => null) {
    const validationText = validationFn();
    const inputControl = this.renderInputControl(propertyPath, placeholder);
    return this.renderFormControl(caption, inputControl, helpText, validationText);
  },

  renderFormControl(controlLabel, control, helpText, errorMsg) {
    return (
      <div className={errorMsg ? 'form-group has-error' : 'form-group'}>
        <label className="col-xs-2 control-label">
          {controlLabel}
        </label>
        <div className="col-xs-10">
          {control}
          <span className="help-block">
            {errorMsg || helpText}
          </span>
        </div>
      </div>
    );
  },

  renderTooltipHelp(message) {
    if (!message) return null;
    return (
      <small>
        <OverlayTrigger placement="right" overlay={<Tooltip>{message}</Tooltip>}>
          <i className="fa fa-fw fa-question-circle"></i>
        </OverlayTrigger>
      </small>
    );
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
    this.props.onSaveQuery(this.query()).then(
      () => this.props.onHideFn());
  }

});
