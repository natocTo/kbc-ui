import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import ExpiresInEdit from './ExpiresInEdit';
import ComponentsStore from '../../components/stores/ComponentsStore';
import ExpiresInfo from './ExpiresInfo';
import ComponentsSelector from './ComponentsSelector';
import TokenString from './TokenString';
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
      dirtyToken: props.token,
      createdToken: null
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
            {!this.props.isEditting ? 'Create token' : `Token ${this.props.token.get('description')}(${this.props.token.get('id')})`}
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
                 disabled={this.isInputDisabled()}
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
               '',
               <div className="col-sm-offset-3 col-sm-9">
                 <ComponentsSelector
                   disabled={this.isInputDisabled()}
                   onChange={(components) => this.updateDirtyToken('componentAccess', components)}
                   selectedComponents={this.state.dirtyToken.get('componentAccess', List())}
                   allComponents={ComponentsStore.getAll()}
                 />
               </div>
            )}
            {isCustomAccess && this.renderFormGroup(
               '',
               <BucketPermissionsManager
                 disabled={this.isInputDisabled()}
                 bucketPermissions={this.state.dirtyToken.get('bucketPermissions', Map())}
                 onChange={(permissions) => this.updateDirtyToken('bucketPermissions', permissions)}
                 allBuckets={this.props.allBuckets}
                 wrapperClassName="cols-sm-offset-3 col-sm-9"
               />
            )}
            {this.state.createdToken && this.renderFormGroup(
               '',
               this.renderTokenCreated()
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isDisabled={!this.isValid() || this.props.token === this.state.dirtyToken || !!this.state.createdToken}
            isSaving={this.props.isSaving}
            onSave={this.handleSave}
            onCancel={this.handleClose}
            placement="right"
            cancelLabel={!!this.state.createdToken ? 'Close' : 'Cancel'}
            saveLabel={this.props.isEditting ? 'Update' : 'Create'}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  isInputDisabled() {
    return this.props.isSaving || !!this.state.createdToken;
  },

  renderTokenCreated() {
    return (
      <div className="col-sm-12">
        <p className="alert alert-success">Token {this.state.createdToken.get('description')} has been created. Make sure to copy it. You won't be able to see it again. </p>
        <TokenString token={this.state.createdToken} />
      </div>
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
              disabled={this.isInputDisabled()}
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
              disabled={this.isInputDisabled()}
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
    const {isEditting} = this.props;
    const radioLabelStyle = isEditting ? {'paddingLeft': '0px', 'cursor': 'default'} : {};
    const canManageBuckets = this.state.dirtyToken.get('canManageBuckets', false);
    const showFull = !isEditting || (isEditting && canManageBuckets);
    const showCustom = !isEditting || (isEditting && !canManageBuckets);
    return (
      <div className="col-sm-9">
        {showFull &&
         <div className="radio">
           <label style={radioLabelStyle}>
             {!isEditting &&
              <input
                type="radio"
                disabled={this.isInputDisabled()}
                checked={canManageBuckets}
                onChange={() => this.updateDirtyToken('canManageBuckets', true)}
              />
             }

             <span>Full Access</span>
           </label>
           <span className="help-block">
             Allow full access to all buckets and components including buckets created in future
           </span>
         </div>
        }
        {showCustom &&
         <div className="radio">
           <label style={radioLabelStyle}>
             {!isEditting &&
              <input
                disabled={this.isInputDisabled()}
                type="radio"
                checked={!canManageBuckets}
                onChange={() => this.updateDirtyToken('canManageBuckets', false)}
              />
             }
             <span>Custom Access</span>
           </label>
           <span className="help-block">
             Only specified components and buckets will be accessible.
           </span>
         </div>
        }
      </div>
    );
  },

  renderDescriptionInput() {
    return (
      <input
        disabled={this.isInputDisabled()}
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
    this.props.onSaveFn(this.state.dirtyToken).then((token) => {
      if (this.props.isEditting) {
        return this.handleClose();
      }
      this.setState({createdToken: token, dirtyToken: token});
    });
  },

  handleClose() {
    this.props.onHideFn();
  }

});
