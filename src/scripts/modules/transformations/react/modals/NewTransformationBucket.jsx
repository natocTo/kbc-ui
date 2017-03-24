import React from 'react';
import {Button, Modal, Input} from 'react-bootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import TransformationActionCreators from '../../ActionCreators';
import {backendOptions, addBackendMap} from '../../utils/transformationBackends';
import ApplicationStore from '../../../../stores/ApplicationStore';


module.exports = React.createClass({
  displayName: 'NewTransformationBucket',

  getInitialState: function() {
    return {
      isLoading: false,
      name: '',
      description: '',
      backend: ApplicationStore.getCurrentProject().get('defaultBackend'),
      showModal: false,
      legacyUI: ApplicationStore.hasCurrentProjectFeature('legacy-transformations-ui')
    };
  },

  close: function() {
    this.setState({
      showModal: false
    });
  },

  open: function() {
    this.setState({
      showModal: true
    });
  },

  renderBackendSelector() {
    if (this.state.legacyUI) {
      return null;
    }
    return (
      <Input
        type="select"
        label="Backend"
        value={this.state.backend}
        onChange={this._setBackend}
        labelClassName="col-sm-4"
        wrapperClassName="col-sm-6"
        >
        {this.backendOptions()}
      </Input>
    );
  },

  backendOptions() {
    const options = backendOptions(ApplicationStore.getSapiToken());
    return options.map(function(option) {
      return (
        <option value={option.value} key={option.value}>{option.label}</option>
      );
    });
  },

  render: function() {
    return (
      <span>
        {this.renderOpenButton()}
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton={true}>
            <Modal.Title>New Transformation Bucket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" onSubmit={this._handleSubmit}>
              <p className="help-block">Transformation bucket is a container for related transformations.</p>
              <Input
                placeholder="My Bucket"
                className="form-control"
                value={this.state.text}
                onChange={this._setName}
                ref="name"
                autoFocus={true}
                type="text"
                label="Name"
                labelClassName="col-sm-4"
                wrapperClassName="col-sm-6"/>
              <Input
                placeholder="A lot of things happening here"
                className="form-control"
                value={this.state.description}
                onChange={this._setDescription}
                ref="description"
                type="textarea"
                label="Description"
                labelClassName="col-sm-4"
                wrapperClassName="col-sm-6"/>
              {this.renderBackendSelector()}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <ConfirmButtons
              isSaving={this.state.isLoading}
              isDisabled={!this._isValid()}
              saveLabel="Create"
              onCancel={this.close}
              onSave={this._handleCreate}
            />
          </Modal.Footer>
        </Modal>
      </span>
    );
  },

  renderOpenButton: function() {
    return (
      <Button onClick={this.open} bsStyle="success">
        <i className="fa fa-plus" />
        &nbsp;
        Add Bucket
      </Button>
    );
  },

  _handleSubmit: function(e) {
    e.preventDefault();
    if (this._isValid()) {
      return this._handleCreate();
    }
  },

  _handleCreate: function() {
    var data;
    this.setState({
      isLoading: true
    });
    data = {
      name: this.state.name,
      description: this.state.description
    };
    if (!this.state.legacyUI) {
      data.configuration = JSON.stringify(addBackendMap({}, this.state.backend));
    }
    TransformationActionCreators.createTransformationBucket(data).then(this.close);
  },

  _setName: function(e) {
    this.setState({
      name: e.target.value.trim()
    });
  },

  _setDescription: function(e) {
    this.setState({
      description: e.target.value
    });
  },

  _setBackend: function(e) {
    this.setState({
      backend: e.target.value
    });
  },

  _isValid: function() {
    return this.state.name.length > 0;
  }
});
