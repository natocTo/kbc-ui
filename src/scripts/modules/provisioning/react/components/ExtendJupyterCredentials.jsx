import React from 'react';
import JupyterSandboxCredentialsStore from '../../stores/JupyterSandboxCredentialsStore';
import ActionCreators from '../../ActionCreators';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ExtendCredentialsButton from './ExtendCredentialsButton';

module.exports = React.createClass({
  displayName: 'ExtendJupyterCredentials',

  mixins: [createStoreMixin(JupyterSandboxCredentialsStore)],

  getStateFromStores: function() {
    return {
      credentials: JupyterSandboxCredentialsStore.getCredentials(),
      isLoaded: JupyterSandboxCredentialsStore.getIsLoaded(),
      isExtending: JupyterSandboxCredentialsStore.getPendingActions().get('extend', false)
    };
  },

  render: function() {
    if (this.state.isLoaded) {
      return (
        <ExtendCredentialsButton
          isExtending={this.state.isExtending}
          onExtend={ActionCreators.extendJupyterSandboxCredentials}
        />
      );
    }
  }
});

