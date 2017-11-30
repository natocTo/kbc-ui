import React, {PropTypes} from 'react';
import ComponentsStore from '../../../components/stores/ComponentsStore';
import ExpiresInEdit from './ExpiresInEdit';
import ExpiresInfo from './ExpiresInfo';
import ComponentsSelector from './ComponentsSelector';
import BucketPermissionsManager from './BucketPermissionsManager';
import {List, Map} from 'immutable';
import {Link} from 'react-router';
import CreatedWithIcon from '../../../../react/common/CreatedWithIcon';

export default React.createClass({

  propTypes: {
    disabled: PropTypes.bool.isRequired,
    isEditting: PropTypes.bool.isRequired,
    token: PropTypes.object.isRequired,
    allBuckets: PropTypes.object.isRequired,
    updateToken: PropTypes.func.isRequired
  },

  render() {
    const isCustomAccess = !this.props.token.get('canManageBuckets', false);
    return (
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
               <ExpiresInfo withIcon={true} token={this.props.token} />
             </p>
           </div>
           :
           <ExpiresInEdit
             disabled={this.props.disabled}
             value={this.props.token.get('expiresIn', null)}
             onChange={(value) => this.props.updateToken('expiresIn', value)}
           />
        )}
        {this.props.isEditting && this.renderFormGroup(
           'Created',
           <div className="col-sm-9">
             <p className="form-control-static">
               <CreatedWithIcon createdTime={this.props.token.get('created')} />
               {this.rednerCreatorTokenLink()}
             </p>
           </div>
        )}
        {this.renderFormGroup(
           'File Uploads',
           this.renderFileUploadsAccessInput()
        )}
        {this.renderFormGroup(
           'Components & Buckets',
           this.renderBucketsAndComponentsAccessInput()
        )}
        {isCustomAccess && this.renderFormGroup(
           '',
           <div className="col-sm-offset-3 col-sm-9">
             <ComponentsSelector
               disabled={this.props.disabled}
               onChange={(components) => this.props.updateToken('componentAccess', components)}
               selectedComponents={this.props.token.get('componentAccess', List())}
               allComponents={ComponentsStore.getAll()}
             />
             <span className="help-block">
               Token can run selected components
             </span>
           </div>
        )}
        {isCustomAccess && this.renderFormGroup(
           '',
           <BucketPermissionsManager
             disabled={this.props.disabled}
             bucketPermissions={this.props.token.get('bucketPermissions', Map())}
             onChange={(permissions) => this.props.updateToken('bucketPermissions', permissions)}
             allBuckets={this.props.allBuckets}
             wrapperClassName="cols-sm-offset-3 col-sm-9"
           />
        )}
      </div>
    );
  },

  rednerCreatorTokenLink() {
    const creatorToken = this.props.token.get('creatorToken', null);
    return creatorToken && (
      <span>
        {' '} by {' '}
        <Link to="tokens-detail" params={{tokenId: creatorToken.get('id')}}>
          {creatorToken.get('description')}
        </Link>
      </span>
    );
  },

  renderDescriptionInput() {
    return (
      <input
        disabled={this.props.disabled}
        className="form-control"
        type="text"
        value={this.props.token.get('description')}
        onChange={(e) => this.props.updateToken('description', e.target.value)}
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

  renderFileUploadsAccessInput() {
    const isFullAccess = this.props.token.get('canReadAllFileUploads', false);
    return (
      <div className="col-sm-9">
        <div className="radio">
          <label>
            <input
              disabled={this.props.disabled}
              type="radio"
              checked={isFullAccess}
              onChange={() => this.props.updateToken('canReadAllFileUploads', true)}
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
              disabled={this.props.disabled}
              type="radio"
              checked={!isFullAccess}
              onChange={() => this.props.updateToken('canReadAllFileUploads', false)}
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
    const canManageBuckets = this.props.token.get('canManageBuckets', false);
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
                disabled={this.props.disabled}
                checked={canManageBuckets}
                onChange={() => this.props.updateToken('canManageBuckets', true)}
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
                disabled={this.props.disabled}
                type="radio"
                checked={!canManageBuckets}
                onChange={() => this.props.updateToken('canManageBuckets', false)}
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
  }

});
