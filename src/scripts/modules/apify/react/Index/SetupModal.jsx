import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import TabbedWizard from './TabbedWizard';
import {Map} from 'immutable';
export default React.createClass({

  propTypes: {
    onHideFn: PropTypes.func,
    show: PropTypes.bool.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired

  },

  render() {
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}>
        <Modal.Header closeButton>
          <Modal.Title>
            Setup Crawler
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderWizard()}
        </Modal.Body>
        <Modal.Footer>
          blabl
        </Modal.Footer>
      </Modal>

    );
  },

  renderWizard() {
    return (
      <TabbedWizard
        localState={this.props.localState}
        updateLocalState={this.props.updateLocalState}
        settings={this.localState('settings', Map())}
        updateSettings={(settings) => this.updateLocalState('settings', settings)}
      />
    );
  },

  renderInputControl(propertyPath, placeholder) {
    return (
      <input
        placeholder={placeholder}
        type="text"
        value={1}
        onChange={() => null}
        className="form-control"
      />
    );
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

  localState(key, defaultValue) {
    return this.props.localState.getIn([].concat(key), defaultValue);
  },

  updateLocalState(path, value) {
    this.props.updateLocalState(path, value);
  }

});
