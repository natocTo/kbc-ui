import React, {PropTypes} from 'react';
// stores
import ConfigurationsStore from '../../ConfigurationsStore';

// actions
import configurationsActions from '../../ConfigurationsActionCreators';

import AuthorizationRow from '../../../oauth-v2/react/AuthorizationRow';

// utils
import * as oauthUtils from '../../../oauth-v2/OauthUtils';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      oauthId: PropTypes.string.isRequired,
      componentId: PropTypes.string.isRequired,
      configurationId: PropTypes.string.isRequired
    })
  },

  render() {
    const configurationId = this.props.value.configurationId;
    const componentId = this.props.value.componentId;
    const oauthCredentialsId = this.props.value.oauthId;

    return (
      <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
        <AuthorizationRow
          showHeader={false}
          id={oauthCredentialsId || configurationId}
          configId={configurationId}
          componentId={componentId}
          credentials={oauthUtils.getCredentials(componentId, oauthCredentialsId)}
          isResetingCredentials={ConfigurationsStore.getPendingActions(componentId, configurationId).has('reset-oauth')}
          onResetCredentials={this.resetOauthCredentials}
        />
      </div>
    );
  },

  resetOauthCredentials() {
    configurationsActions.resetOauthCredentials(this.props.value.componentId, this.props.value.configurationId);
  }
});
