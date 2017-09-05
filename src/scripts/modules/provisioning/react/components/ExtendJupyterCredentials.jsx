import React from 'react';
import JupyterSandboxCredentialsStore from '../../stores/JupyterSandboxCredentialsStore';
import ActionCreators from '../../ActionCreators';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ExtendCredentialsButton from './ExtendCredentialsButton';

export default React.createClass({
  mixins: [createStoreMixin(JupyterSandboxCredentialsStore)],

  getStateFromStores: function() {
    return {
      credentials: JupyterSandboxCredentialsStore.getCredentials(),
      isLoaded: JupyterSandboxCredentialsStore.getIsLoaded(),
      isExtending: JupyterSandboxCredentialsStore.getPendingActions().get('extend', false),
      isDisabled: JupyterSandboxCredentialsStore.getPendingActions().size > 0
    };
  },

  render: function() {
    if (this.state.isLoaded) {
      return (
        <ExtendCredentialsButton
          isExtending={this.state.isExtending}
          onExtend={ActionCreators.extendJupyterSandboxCredentials}
          disabled={this.state.isDisabled}
        />
      );
    }
    return null;
  }
});
