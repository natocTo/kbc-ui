import React, {PropTypes} from 'react';
import {Modal, Tab, Tabs} from 'react-bootstrap';

export default React.createClass({

  propTypes: {
    onHideFn: PropTypes.func,
    show: PropTypes.bool.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired
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
          blablabl
        </Modal.Footer>
      </Modal>

    );
  },

  renderWizard() {
    return (
      <Tabs>
        <Tab title="Setup Token">
          <div className="row form-horizontal clearfix">
            <div className="form-group">
              blablabla
            </div>
          </div>
        </Tab>
        <Tab title="Select Crawler">
          Select crawler
        </Tab>
        <Tab title="Crawler Settings(optional)">
          Crawler Settings
        </Tab>
      </Tabs>
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
  }

});
