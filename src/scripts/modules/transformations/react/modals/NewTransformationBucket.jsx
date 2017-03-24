import React from 'react';
import {Button, Modal, Input} from 'react-bootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import TransformationActionCreators from '../../ActionCreators';

module.exports = React.createClass({
  displayName: 'NewTransformationBucket',

  getInitialState: function() {
    return {
      isLoading: false,
      name: '',
      description: '',
      showModal: false
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
                placeholder="My bucket"
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
            </form>
          </Modal.Body>
          <Modal.Footer>
            <ConfirmButtons
              isSaving={this.state.isLoading}
              isDisabled={this._isValid()}
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
    this.setState({
      isLoading: true
    });
    TransformationActionCreators.createTransformationBucket({
      name: this.state.name,
      description: this.state.description
    }).then(this.close);
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

  _isValid: function() {
    return this.state.name.length > 0;
  }
});
