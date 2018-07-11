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
      context: PropTypes.object.isRequired
    })
  },

  render() {
    const configurationId = this.props.value.context.configurationId;
    const componentId = this.props.value.context.componentId;
    const oauthCredentialsId = this.props.value.oauthId;

    return (
      <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
        <AuthorizationRow
          showHeader={false}
          id={oauthCredentialsId}
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
    configurationsActions.resetOauthCredentials(this.props.value.context.componentId, this.props.value.context.configurationId);
  }
});
