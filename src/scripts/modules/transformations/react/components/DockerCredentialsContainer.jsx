import React from 'react';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import DeleteButton from '../../../../react/common/DeleteButton';
import ExtendJupyterCredentials from '../../../provisioning/react/components/ExtendJupyterCredentials';
import ExtendRStudioCredentials from '../../../provisioning/react/components/ExtendRStudioCredentials';
import JupyterSandboxCredentialsStore from '../../../provisioning/stores/JupyterSandboxCredentialsStore';
import RStudioSandboxCredentialsStore from '../../../provisioning/stores/RStudioSandboxCredentialsStore';
import JupyterCredentials from '../../../provisioning/react/components/JupyterCredentials';
import RStudioCredentials from '../../../provisioning/react/components/RStudioCredentials';
import CredentialsActionCreators from '../../../provisioning/ActionCreators';

export default React.createClass({

  mixins: [createStoreMixin(JupyterSandboxCredentialsStore, RStudioSandboxCredentialsStore)],

  componentDidMount() {
    if (!this.state.credentials.get('id') && this.props.isAutoLoad) {
      if (this.isPythonTransformation()) {
        CredentialsActionCreators.loadJupyterSandboxCredentials();
      } else {
        CredentialsActionCreators.loadRStudioSandboxCredentials();
      }
    }
  },

  propTypes: {
    isAutoLoad: React.PropTypes.bool.isRequired,
    type: React.PropTypes.string
  },

  getStateFromStores() {
    const dockerCredentialsStore = this.isPythonTransformation() ? JupyterSandboxCredentialsStore : RStudioSandboxCredentialsStore;
    return {
      credentials: dockerCredentialsStore.getCredentials(),
      pendingActions: dockerCredentialsStore.getPendingActions(),
      isLoading: dockerCredentialsStore.getIsLoading(),
      isLoaded: dockerCredentialsStore.getIsLoaded(),
      validUntil: dockerCredentialsStore.getValidUntil()
    };
  },

  isPythonTransformation() {
    return this.props.type === 'python';
  },

  renderCreateInfo() {
    return (
      <div className="col-md-12">
        <p>
          You will create a new sandbox and load all required data in the input mapping of the transformation along with the transformation script.
        </p>
      </div>
    );
  },

  renderLoadingInfo() {
    return (
      <div className="col-md-12">
        <p> Looking for existing sandbox... </p>
      </div>
    );
  },

  render() {
    if (this.state.isLoading) return this.renderLoadingInfo();
    if (!this.state.credentials.get('id') && !this.state.isLoading) return this.renderCreateInfo();
    const isPython = this.isPythonTransformation();
    return (
      <span>
        <div className="help-block col-md-12">
          Note: To create a new sandbox or load new data you have to drop the current sandbox.
        </div>
        <div className="col-md-8">
          {isPython ?
            <JupyterCredentials
              validUntil={this.state.validUntil}
              credentials={this.state.credentials}
              isLoading={this.state.isLoading}
              isCreating={this.state.pendingActions.get('create')}/>
            :
            <RStudioCredentials
              credentials={this.state.credentials}
              validUntil={this.state.validUntil}
              isCreating={this.state.pendingActions.get('create')}/>
          }
        </div>
        <div className="col-md-3">
          {this.renderDockerConnect()}
        </div>
      </span>
    );
  },

  renderDockerConnect() {
    return (
      <div>
        <a
          href={this._connectLink(this.state.credentials)}
          className="btn btn-link"
          target="_blank"
          disabled={this.state.pendingActions.get('drop')}
        >
          <span className="fa fa-fw fa-database"/>
      &nbsp;Connect
        </a>
        <div>
          <DeleteButton
            tooltip="Delete Sandbox"
            isPending={this.state.pendingActions.get('drop')}
            label="Drop sandbox"
            fixedWidth={true}
            confirm={{
              title: 'Delete Sandbox',
              text: 'Do you really want to delete the sandbox?',
              onConfirm: this._dropCredentials
            }}
          />
        </div>
        <div>
          {this.isPythonTransformation() ?
            <ExtendJupyterCredentials/>
            :
            <ExtendRStudioCredentials/>
          }
        </div>
      </div>
    );
  },

  _dropCredentials: function() {
    if (this.isPythonTransformation()) {
      return CredentialsActionCreators.dropJupyterSandboxCredentials();
    } else {
      return CredentialsActionCreators.dropRStudioSandboxCredentials();
    }
  },

  _connectLink(credentials) {
    if (this.isPythonTransformation()) {
      return (credentials.get('hasHttps') ? 'https://' : 'http://') + credentials.get('hostname') + ':' + credentials.get('port') + '/notebooks/notebook.ipynb';
    } else {
      return (credentials.get('hasHttps') ? 'https://' : 'http://') + credentials.get('hostname') + ':' + credentials.get('port');
    }
  }

});
