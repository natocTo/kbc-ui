import React from 'react';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import DeleteButton from '../../../../react/common/DeleteButton';
import ExtendJupyterCredentials from '../../../provisioning/react/components/ExtendJupyterCredentials';
import JupyterSandboxCredentialsStore from '../../../provisioning/stores/JupyterSandboxCredentialsStore';
import JupyterCredentials from '../../../provisioning/react/components/JupyterCredentials';

import CredentialsActionCreators from '../../../provisioning/ActionCreators';

export default React.createClass({

  mixins: [createStoreMixin(JupyterSandboxCredentialsStore)],

  componentDidMount() {
    if (!this.state.credentials.get('id') && this.props.isAutoLoad) {
      if (this.props.type === 'python') {
        CredentialsActionCreators.loadJupyterSandboxCredentials();
      }
    }
  },

  propTypes: {
    isAutoLoad: React.PropTypes.bool.isRequired,
    type: React.PropTypes.string
  },

  getStateFromStores() {
    return {
      credentials: JupyterSandboxCredentialsStore.getCredentials(),
      pendingActions: JupyterSandboxCredentialsStore.getPendingActions(),
      isLoading: JupyterSandboxCredentialsStore.getIsLoading(),
      isLoaded: JupyterSandboxCredentialsStore.getIsLoaded(),
      validUntil: JupyterSandboxCredentialsStore.getValidUntil()
    };
  },

  render() {
    return (
      <div className="row">
        <div className="col-md-9">
          <JupyterCredentials
            validUntil={this.state.validUntil}
            type={this.props.type}
            credentials={this.state.credentials}
            isLoading={this.state.isLoading}
            isCreating={this.state.pendingActions.get('create')}/>
        </div>
        <div className="col-md-3">
          {this.renderDockerConnect()}
        </div>
      </div>

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
            tooltip="Delete Jupyter Sandbox"
            isPending={this.state.pendingActions.get('drop')}
            label="Drop sandbox"
            fixedWidth={true}
            confirm={{
              title: 'Delete Jupyter Sandbox',
              text: 'Do you really want to delete the Jupyter sandbox?',
              onConfirm: this._dropCredentials
            }}
          />
        </div>
        <div>
          <ExtendJupyterCredentials/>
        </div>
      </div>
    );
  },

  _dropCredentials: function() {
    return CredentialsActionCreators.dropJupyterSandboxCredentials();
  },

  _connectLink(credentials) {
    return (credentials.get('hasHttps') ? 'https://' : 'http://') + credentials.get('hostname') + ':' + credentials.get('port') + '/notebooks/notebook.ipynb';
  }

});
