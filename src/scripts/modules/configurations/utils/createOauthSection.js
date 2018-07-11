import Immutable from 'immutable';
import OauthSection from '../react/components/OauthSection';
import {CollapsibleSection} from '../utils/renderHelpers';

export default function() {
  return {
    render: CollapsibleSection({
      title: 'Authorization',
      contentComponent: OauthSection,
      options: {
        includeSaveButtons: false
      }
    }),
    onLoad: function(configuration) {
      return Immutable.fromJS({
        oauthId: configuration.getIn(['authorization', 'oauth_api', 'id'], '')
      });
    },
    onSave: function(localState) {
      return Immutable.fromJS({
        authorization: {
          oauth_api: {
            id: localState.get('oauthId')
          }
        }
      });
    },
    isComplete: function(configuration) {
      return configuration.hasIn(['authorization', 'oauth_api', 'id']);
    }
  };
}
