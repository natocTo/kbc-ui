import React from 'react';
import RStudioSandboxCredentialsStore from '../../stores/RStudioSandboxCredentialsStore';
import ActionCreators from '../../ActionCreators';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ExtendCredentialsButton from './ExtendCredentialsButton';

module.exports = React.createClass({
  displayName: 'ExtendRStudioCredentials',

  mixins: [createStoreMixin(RStudioSandboxCredentialsStore)],

  getStateFromStores: function() {
    return {
      credentials: RStudioSandboxCredentialsStore.getCredentials(),
      isLoaded: RStudioSandboxCredentialsStore.getIsLoaded(),
      isExtending: RStudioSandboxCredentialsStore.getPendingActions().get('extend', false)
    };
  },

  render: function() {
    if (this.state.isLoaded) {
      return (
        <ExtendCredentialsButton
          isExtending={this.state.isExtending}
          onExtend={ActionCreators.extendRStudioSandboxCredentials}
        />
      );
    }
  }
});

