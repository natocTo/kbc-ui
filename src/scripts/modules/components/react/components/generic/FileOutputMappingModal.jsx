import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../../../react/common/ConfirmButtons';
import Editor from './FileOutputMappingEditor';
import Tooltip from '../../../../../react/common/Tooltip';

const MODE_CREATE = 'create', MODE_EDIT = 'edit';

export default React.createClass({
  propTypes: {
    mode: PropTypes.oneOf([MODE_CREATE, MODE_EDIT]),
    mapping: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onEditStart: PropTypes.func,
    onSave: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      isSaving: false,
      show: false
    };
  },

  getDefaultProps() {
    return {
      onEditStart: () => {}
    };
  },

  isValid() {
    return !!(this.props.mapping.get('source'));
  },

  render() {
    return (
      <span>
        {this.renderOpenButton()}
        <Modal {...this.props} show={this.state.show}
          onHide={this.handleCancel}
          title="Output Mapping" bsSize="large" onChange={() => null}>
          <div className="modal-body">
            {this.editor()}
          </div>
          <div className="modal-footer">
            <ConfirmButtons
              saveLabel={this.props.mode === MODE_CREATE ? 'Create' : 'Save'}
              isSaving={this.state.isSaving}
              onCancel={this.handleCancel}
              onSave={this.handleSave}
              isDisabled={!this.isValid()}
            />
          </div>
        </Modal>
      </span>
    );
  },

  editor() {
    const props = {
      value: this.props.mapping,
      disabled: this.state.isSaving,
      onChange: this.props.onChange
    };
    return React.createElement(Editor, props);
  },

  handleCancel() {
    this.closeModal();
    this.props.onCancel();
  },

  handleEditButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.openModal();
    this.props.onEditStart();
  },

  openModal() {
    this.setState({show: true});
  },

  closeModal() {
    this.setState({
      show: false,
      isSaving: false
    });
  },

  renderOpenButton() {
    if (this.props.mode === MODE_EDIT) {
      return (
        <Tooltip placement="top" tooltip="Edit Output">
          <button className="btn btn-link"
            onClick={this.handleEditButtonClick}>
            <span className="fa fa-pencil" />
          </button>
        </Tooltip>
      );
    } else {
      return (
        <button className="btn btn-primary" onClick={this.openModal}>
          <span className="fa fa-fw fa-plus" /> Add File Output
        </button>
      );
    }
  },

  handleSave() {
    this.setState({
      isSaving: true
    });
    this.props
        .onSave()
        .then(() => {
          this.setState({
            isSaving: false
          });
          this.closeModal();
        })
        .catch((e) => {
          this.setState({
            isSaving: false
          });
          throw e;
        });
  }

});
