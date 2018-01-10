import _ from 'underscore';

import Promise from 'bluebird';

import StorageService from '../tokens/actionCreators';
import SapiStorage from '../tokens/StorageTokensStore';

import ProvisioningStore from '../provisioning/stores/WrDbCredentialsStore';
import ProvisioningActions from '../provisioning/ActionCreators';

function getToken(desc, legacyDesc) {
  return StorageService.loadTokens().then(function() {
    let tokens, wrDbToken;
    tokens = SapiStorage.getAll();
    wrDbToken = tokens.find(function(token) {
      let ref;
      return (ref = token.get('description')) === desc || ref === legacyDesc;
    });
    return wrDbToken;
  });
}

function loadCredentials(token, componentId, driver) {
  const permissions = 'writer';
  return ProvisioningActions.loadWrDbCredentials(permissions, token, driver).then(function() {
    let credentials = ProvisioningStore.getCredentials(permissions, token);
    if (credentials) {
      return credentials;
    } else {
      return ProvisioningActions.createWrDbCredentials(permissions, token, driver).then(function() {
        return ProvisioningStore.getCredentials(permissions, token);
      });
    }
  });
}

function retrieveProvisioningCredentials(token, componentId, driver) {
  if (driver === 'redshift' || driver === 'snowflake') {
    return loadCredentials(token, componentId, driver);
  } else {
    return Promise.props({});
  }
}

export default function(componentId, driver) {
  return {
    isProvisioningCredentials(credentials) {
      const host = credentials.get('host', '');
      if (driver === 'mysql') {
        return host === 'wr-db-aws.keboola.com';
      }
      if (driver === 'redshift') {
        return _.str.include(host, 'redshift.amazonaws.com') && _.str.include(host, 'sapi');
      }
      if (driver === 'snowflake') {
        return _.str.include(host, 'keboola.snowflakecomputing.com') || _.str.include(host, 'keboola.eu-central-1.snowflakecomputing.com');
      }
      return false;
    },
    getCredentials(configId) {
      const desc = _.str.sprintf('wrdb%s_%s', driver, configId);
      const legacyDesc = _.str.sprintf('wrdb%s', driver);
      let wrdDbToken = null;
      return getToken(desc, legacyDesc).then(function(token) {
        wrdDbToken = token;
        if (!wrdDbToken) {
          const params = {
            description: desc,
            canManageBuckets: 1
          };

          return StorageService.createToken(params).then(function(newToken) {
            return newToken.get('token');
          });
        } else {
          wrdDbToken = wrdDbToken.get('token');
          return retrieveProvisioningCredentials(wrdDbToken, componentId, driver);
        }
      });
    }
  };
}
