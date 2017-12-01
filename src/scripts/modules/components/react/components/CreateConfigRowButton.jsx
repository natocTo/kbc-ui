import React, {PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Immutable from 'immutable';

import {Input} from '../../../../react/common/KbcBootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import InstalledComponentsActionCreators from '../../InstalledComponentsActionCreators';

import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';


export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    componentId: PropTypes.string.isRequired,
    configId: PropTypes.string.isRequired,
    onRowCreated: PropTypes.func.isRequired,
    emptyConfig: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string
  },

  getDefaultProps() {
    return {
      type: 'link',
      label: 'New Row'
    };
  },

  getInitialState() {
    return {
      isSaving: false,
      showModal: false,
      form: Immutable.fromJS({
        name: '',
        description: ''
      })
    };
  },

  open() {
    this.setState({showModal: true});
  },

  close() {
    this.setState(this.getInitialState());
  },

  onRowCreated() {
    this.close();
    this.props.onRowCreated();
  },

  renderModal() {
    return (
      <Modal onHide={this.close} show={this.state.showModal}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {this.props.label}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.form()}
        </Modal.Body>

        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.state.isSaving}
            isDisabled={!this.isValid()}
            saveLabel={this.props.label}
            onCancel={this.close}
            onSave={this.handleCreate}
            />
        </Modal.Footer>
      </Modal>
    );
  },

  render() {
    if (this.props.type === 'button') {
      return (
        <Button onClick={this.handleOpenButtonClick} bsStyle="success">
          <i className="kbc-icon-plus" />{' '}{this.props.label}
          {this.renderModal()}
        </Button>
      );
    } else {
      return (
        <a onClick={this.handleOpenButtonClick}>
          <i className="kbc-icon-plus" />{' '}{this.props.label}
          {this.renderModal()}
        </a>
      );
    }
  },

  handleOpenButtonClick(e) {
    e.preventDefault();
    this.open();
  },

  form() {
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <Input
          type="text"
          value={this.state.form.get('name')}
          autoFocus={true}
          onChange={this.handleChange.bind(this, 'name')}
          placeholder="Name"
          label="Name"
          ref="name"
          labelClassName="col-sm-4"
          wrapperClassName="col-sm-6"/>
        <Input
          type="textarea"
          value={this.state.form.get('description')}
          onChange={this.handleChange.bind(this, 'description')}
          placeholder="Description"
          label="Description"
          labelClassName="col-sm-4"
          wrapperClassName="col-sm-6"/>
      </form>
    );
  },

  isValid() {
    return this.state.form.get('name').length > 0;
  },

  handleChange(field, e) {
    this.setState({
      form: this.state.form.set(field, e.target.value)
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.handleCreate();
    }
  },

  handleCreate() {
    this.setState({isSaving: true});
    InstalledComponentsActionCreators.createConfigurationRow(
      this.props.componentId,
      this.props.configId,
      this.state.form.get('name'),
      this.state.form.get('description'),
      this.props.emptyConfig(this.state.form.toJS())
    ).then(
      this.onRowCreated
    ).catch(() => {
      this.setState({isSaving: false});
    });
  }
});
