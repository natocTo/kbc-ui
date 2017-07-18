import React from 'react';
import MySqlSandboxCredentialsStore from '../../stores/MySqlSandboxCredentialsStore';
import ActionCreators from '../../ActionCreators';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ExtendCredentialsButton from './ExtendCredentialsButton';

module.exports = React.createClass({
  displayName: 'ExtendMySqlCredentials',

  mixins: [createStoreMixin(MySqlSandboxCredentialsStore)],

  getStateFromStores: function() {
    return {
      credentials: MySqlSandboxCredentialsStore.getCredentials(),
      isLoaded: MySqlSandboxCredentialsStore.getIsLoaded(),
      isExtending: MySqlSandboxCredentialsStore.getPendingActions().get('extend', false)
    };
  },

  render: function() {
    if (this.state.isLoaded) {
      return (
        <ExtendCredentialsButton
          isExtending={this.state.isExtending}
          onExtend={ActionCreators.extendMySqlSandboxCredentials}
        />
      );
    }
  }
});

