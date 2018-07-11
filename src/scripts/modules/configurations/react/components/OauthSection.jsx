import React from 'react';
// stores
import ConfigurationsStore from '../../ConfigurationsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import OauthStore from '../../../oauth-v2/Store';

// actions
import configurationsActions from '../../ConfigurationsActionCreators';

import AuthorizationRow from '../../../oauth-v2/react/AuthorizationRow';

// utils
import * as oauthUtils from '../../../oauth-v2/OauthUtils';

export default React.createClass({
  mixins: [createStoreMixin(ConfigurationsStore, OauthStore, RoutesStore)],

  getStateFromStores() {
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const settings = RoutesStore.getRouteSettings();
    const componentId = settings.get('componentId');
    const configuration = ConfigurationsStore.get(componentId, configurationId);
    const oauthCredentialsId = oauthUtils.getCredentialsId(configuration) || configurationId;
    return {
      componentId: componentId,
      settings: settings,
      configurationId: configurationId,
      oauthCredentialsId: oauthCredentialsId,
      oauthCredentials: oauthUtils.getCredentials(componentId, oauthCredentialsId)
    };
  },


  render() {
    return (
      <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
        <AuthorizationRow
          showHeader={false}
          id={this.state.oauthCredentialsId}
          configId={this.state.configurationId}
          componentId={this.state.componentId}
          credentials={this.state.oauthCredentials}
          isResetingCredentials={ConfigurationsStore.getPendingActions(this.state.componentId, this.state.configurationId).has('reset-oauth')}
          onResetCredentials={this.resetOauthCredentials}
        />
      </div>
    );
  },

  resetOauthCredentials() {
    configurationsActions.resetOauthCredentials(this.state.componentId, this.state.configurationId);
  }
});
