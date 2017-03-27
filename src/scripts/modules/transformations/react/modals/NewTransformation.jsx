import React from 'react';
import {Modal, Input} from 'react-bootstrap';
import {Map} from 'immutable';
import {createTransformation} from '../../ActionCreators';
import {backendOptions, addBackendMap} from '../../utils/transformationBackends';

import ConfirmButtons from '../../../../react/common/ConfirmButtons';

import ApplicationStore from '../../../../stores/ApplicationStore';

export default React.createClass({
  propTypes: {
    bucket: React.PropTypes.object.isRequired,
    onRequestHide: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      data: Map({
        isSaving: false,
        name: '',
        description: '',
        backend: ApplicationStore.getCurrentProject().get('defaultBackend')
      }),
      showModal: false,
      legacyUI: ApplicationStore.hasCurrentProjectFeature('legacy-transformations-ui')
    };
  },

  open() {
    var data = this.state.data;
    data = data.set('name', '');
    data = data.set('description', '');
    data = data.set('backend', ApplicationStore.getCurrentProject().get('defaultBackend'));
    this.setState({
      showModal: true,
      data: data
    });
  },

  close() {
    this.setState({
      showModal: false
    });
  },

  render() {
    return (
      <a onClick={this.handleOpenButtonClick}>
        <i className="fa fa-fw fa-plus" />
        {' Add transformation'}
        <Modal onHide={this.close} show={this.state.showModal}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              New Transformation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.form()}
          </Modal.Body>
          <Modal.Footer>
            <ConfirmButtons
              isSaving={this.state.data.get('isSaving')}
              isDisabled={!this.isValid()}
              saveLabel="Create"
              onCancel={this.close}
              onSave={this.handleCreate}
              />
          </Modal.Footer>
        </Modal>
      </a>
    );
  },

  handleOpenButtonClick(e) {
    e.preventDefault();
    this.open();
  },

  renderBackendSelector() {
    if (this.state.legacyUI) {
      return (
        <Input
          type="select"
          label="Backend"
          value={this.state.data.get('backend')}
          onChange={this.handleChange.bind(this, 'backend')}
          labelClassName="col-sm-4"
          wrapperClassName="col-sm-6"
        >
          {this.backendOptions()}
        </Input>
      );
    } else {
      return null;
    }
  },

  form() {
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <p className="help-block">
          Create new transformation in bucket <strong>{ this.props.bucket.get('name') }</strong>
        </p>
        <Input
          type="text"
          value={this.state.data.get('name')}
          autoFocus={true}
          onChange={this.handleChange.bind(this, 'name')}
          placeholder="My Transformation"
          label="Name"
          ref="name"
          labelClassName="col-sm-4"
          wrapperClassName="col-sm-6"/>
        <Input
          type="textarea"
          value={this.state.data.get('description')}
          onChange={this.handleChange.bind(this, 'description')}
          placeholder="It does this and that"
          label="Description"
          labelClassName="col-sm-4"
          wrapperClassName="col-sm-6"/>
        {this.renderBackendSelector()}
      </form>
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


  isValid() {
    return this.state.data.get('name').length > 0;
  },

  handleChange(field, e) {
    this.setState({
      data: this.state.data.set(field, e.target.value)
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.handleCreate();
    }
  },

  handleCreate() {
    var data;
    this.setState({
      data: this.state.data.set('isSaving', true)
    });
    data = {
      name: this.state.data.get('name'),
      description: this.state.data.get('description')
    };
    if (this.state.legacyUI) {
      data = addBackendMap(data, this.state.data.get('backend'));
    } else {
      data.backend = this.props.bucket.getIn(['configuration', 'backend']);
      data.type = this.props.bucket.getIn(['configuration', 'type']);
    }
    createTransformation(this.props.bucket.get('id'), data)
      .then(this.props.onRequestHide)
      .catch(() => {
        this.setState({
          data: this.state.data.set('isSaving', false)
        });
      });
  }

});
