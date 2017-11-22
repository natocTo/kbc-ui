import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import ExpiresInEdit from './ExpiresInEdit';

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
          <div className="form form-horizontal">
            {this.renderFormGroup(
               'Description',
               <div className="col-sm-9">
                 {this.renderDescriptionInput()}
               </div>
            )}
            {this.props.isCreate && this.renderFormGroup(
               'Expires In',
               <ExpiresInEdit
                 value={this.state.dirtyToken.get('expiresIn', null)}
                 onChange={(value) => this.updateDirtyToken('expiresIn', value)}
                 wrapperClassName="col-sm-9"
               />
            )}

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

  updateDirtyToken(key, value) {
    const {dirtyToken} = this.state;
    this.setState({dirtyToken: dirtyToken.set(key, value)});
  },

  renderDescriptionInput() {
    return (
      <input
        className="form-control"
        type="text"
        value={this.state.dirtyToken.get('description')}
        onChange={(e) => this.updateDirtyToken('description', e.target.value)}
      />
    );
  },

  renderFormGroup(labelComponent, controlComponent) {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">
          {labelComponent}
        </label>
        <div className="col-sm-9">
          {controlComponent}
        </div>
      </div>
    );
  },

  handleSave() {
    this.props.onSaveFn(this.state.dirtyToken).then(this.handeClose);
  },

  handleClose() {
    this.props.onHideFn();
  }

});
