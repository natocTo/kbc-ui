import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import ExpiresInEdit from './ExpiresInEdit';
import ComponentsStore from '../../components/stores/ComponentsStore';
import ExpiresInfo from './ExpiresInfo';
import ComponentsSelector from './ComponentsSelector';
import BucketPermissionsManager from './BucketPermissionsManager';
import {List, Map} from 'immutable';

export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    onHideFn: PropTypes.func.isRequired,
    onSaveFn: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isEditting: PropTypes.bool.isRequired,
    token: PropTypes.object.isRequired,
    allBuckets: PropTypes.object.isRequired
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
    const isCustomAccess = !this.state.dirtyToken.get('canManageBuckets', false);
    return (
      <Modal
      bsSize="large"
      show={this.props.show}
      onHide={this.handleClose}
      >
      <Modal.Header closeButton>
      <Modal.Title>
      {!this.props.isEditting ? 'Create token' : `Update token ${this.props.token.get('description')}(${this.props.token.get('id')})`}
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
      {this.renderFormGroup(
        'Expires In',
        this.props.isEditting ?
        <div className="col-sm-9">
          <p className="form-control-static">
            <ExpiresInfo token={this.props.token} />
          </p>
        </div>
        :
        <ExpiresInEdit
          value={this.state.dirtyToken.get('expiresIn', null)}
          onChange={(value) => this.updateDirtyToken('expiresIn', value)}
        />
      )}
      {this.renderFormGroup(
        'File Uploads Access',
        this.renderFileUploadsAccessInput()
      )}
      {this.renderFormGroup(
        'Buckets&Components Access',
        this.renderBucketsAndComponentsAccessInput()
      )}
      {isCustomAccess && this.renderFormGroup(
        'Components Custom Access',
        <div className="col-sm-9">
          <ComponentsSelector
            onChange={(components) => this.updateDirtyToken('componentAccess', components)}
            selectedComponents={this.state.dirtyToken.get('componentAccess', List())}
            allComponents={ComponentsStore.getAll()}
          />
        </div>
      )}
      {isCustomAccess && this.renderFormGroup(
        'Buckets Custom Access',
        <BucketPermissionsManager
          bucketPermissions={this.state.dirtyToken.get('bucketPermissions', Map())}
          onChange={(permissions) => this.updateDirtyToken('bucketPermissions', permissions)}
          allBuckets={this.props.allBuckets}
          wrapperClassName="col-sm-9"
        />
      )}

      </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isDisabled={!this.isValid() || this.props.token === this.state.dirtyToken}
            isSaving={this.props.isSaving}
            onSave={this.handleSave}
            onCancel={this.handleClose}
            placement="right"
            saveLabel={this.props.isEditting ? 'Update' : 'Create'}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  updateDirtyToken(key, value) {
    const {dirtyToken} = this.state;
    this.setState({dirtyToken: dirtyToken.set(key, value)});
  },

  renderFileUploadsAccessInput() {
    const isFullAccess = this.state.dirtyToken.get('canReadAllFileUploads', false);
    return (
      <div className="col-sm-9">
        <div className="radio">
          <label>
            <input
              type="radio"
              checked={isFullAccess}
              onChange={() => this.updateDirtyToken('canReadAllFileUploads', true)}
            />
            <span>Full Access</span>
          </label>
        </div>
        <span className="help-block">
          Allow access to all file uploads
        </span>
        <div className="radio">
          <label>
            <input
              type="radio"
              checked={!isFullAccess}
              onChange={() => this.updateDirtyToken('canReadAllFileUploads', false)}
            />
            <span>Restricted Access</span>
          </label>
        </div>
        <span className="help-block">
          Only files uploaded by the token are accessible
        </span>
      </div>
    );
  },

  renderBucketsAndComponentsAccessInput() {
    const canManageBuckets = this.state.dirtyToken.get('canManageBuckets', false);
    return (
      <div className="col-sm-9">
        <div className="radio">
          <label>
            <input
              type="radio"
              disabled={this.props.isEditting}
              checked={canManageBuckets}
              onChange={() => this.updateDirtyToken('canManageBuckets', true)}
            />
            <span>Full Access</span>
          </label>
        </div>
        <span className="help-block">
          Allow full access to all buckets and components including buckets created in future
        </span>
        <div className="radio">
          <label>
            <input
              disabled={this.props.isEditting}
              type="radio"
              checked={!canManageBuckets}
              onChange={() => this.updateDirtyToken('canManageBuckets', false)}
            />
            <span>Custom Access</span>
          </label>
        </div>
        <span className="help-block">
          Only specified components and buckets will be accessible.
        </span>
      </div>
    );
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
        {controlComponent}
      </div>
    );
  },

  isValid() {
    const {dirtyToken} = this.state;
    const expiresIn = dirtyToken.get('expiresIn');
    const validExpiresIn = expiresIn !== 0;
    return !!dirtyToken.get('description') && validExpiresIn;
  },

  handleSave() {
    this.props.onSaveFn(this.state.dirtyToken).then(this.handleClose);
  },

  handleClose() {
    this.props.onHideFn();
  }

});
