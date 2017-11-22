import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';

export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    onHideFn: PropTypes.func.isRequired,
    onSaveFn: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isCreate: PropTypes.bool.isRequired,
    token: PropTypes.object.isRequired
  },

  getInitialState() {
    return this.getStateFromProps(this.props);
  },

  getStateFromProps(props) {
    return {
      dirtyToken: props.token
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && !this.props.isSaving) {
      this.setState(this.getStateFromProps(nextProps));
    }
  },

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.isCreate ? 'Create' : 'Update'} Token
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            asdasd
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.isSaving}
            onSave={this.handleSave}
            onCancel={this.handleClose}
            placement="right"
            saveLabel="Save"
          />
        </Modal.Footer>
      </Modal>
    );
  },

  handleSave() {
    this.props.onSaveFn(this.state.dirtyToken).then(this.handeClose);
  },

  handleClose() {
    this.props.onHideFn();
  }

});
