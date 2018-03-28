import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import SapiTableSelector from '../../../components/react/components/SapiTableSelector';

import { Input } from '../../../../react/common/KbcBootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import ConfigurationRowsActions from '../../ConfigurationRowsActionCreators';

import immutableMixin from 'react-immutable-render-mixin';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    componentId: PropTypes.string.isRequired,
    configId: PropTypes.string.isRequired,
    onRowCreated: PropTypes.func.isRequired,
    emptyConfig: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    createChangeDescription: PropTypes.func
  },

  getDefaultProps() {
    return {
      type: 'link',
      label: 'Add Row',
      createChangeDescription: function(name) {
        return 'Row ' + name + ' added';
      }
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

  onRowCreated(rowId) {
    this.close();
    this.props.onRowCreated(rowId);
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
            saveLabel="Create"
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

  renderTableSelector() {
    return (
      <div className="form-group">
        <label className="col-sm-4 control-label">
          Table
        </label>
        <div className="col-sm-6">
          <SapiTableSelector
            placeholder="Select..."
            value={this.state.form.get('name')}
            onSelectTableFn= {this.setSelectedTable}
            excludeTableFn= { () => false}/>
        </div>
      </div>

    );
  },

  setSelectedTable(newTableId) {
    this.setState({
      form: this.state.form.set('name', newTableId)
    });
  },

  form() {
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        {this.renderTableSelector()}
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
    ConfigurationRowsActions.create(
      this.props.componentId,
      this.props.configId,
      this.state.form.get('name'),
      this.state.form.get('description'),
      this.props.emptyConfig,
      this.onRowCreated,
      this.props.createChangeDescription(this.state.form.get('name'))
    ).catch(() => {
      this.setState({isSaving: false});
    });
  }
});
