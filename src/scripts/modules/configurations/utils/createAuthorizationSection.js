import Immutable from 'immutable';
import authorization from './authoriaztionConstants';
import OauthSection from '../react/components/OauthSection';
import {CollapsibleSection} from '../utils/renderHelpers';

export default function(authorizationType) {
  let AuthorizationComponent;
  if (authorizationType === authorization.OAUTH) {
    AuthorizationComponent = OauthSection;
  }
  return {
    render: CollapsibleSection({
      title: 'Authorization',
      contentComponent: AuthorizationComponent,
      options: {
        includeSaveButtons: false
      }
    }),
    onLoad: function(configuration) {
      if (authorizationType === authorization.OAUTH) {
        return Immutable.fromJS({
          oauthId: configuration.getIn(['authorization', 'oauth_api', 'id'], '')
        });
      }
      return Immutable.fromJS({});
    },
    onSave: function(localState) {
      if (authorizationType === authorization.OAUTH && localState.get('oauthId', '') !== '') {
        return Immutable.fromJS({
          authorization: {
            oauth_api: {
              id: localState.get('oauthId')
            }
          }
        });
      }
      return Immutable.fromJS({});
    },
    isComplete: function(configuration) {
      return configuration.hasIn(['authorization', 'oauth_api', 'id']);
    }
  };
}
