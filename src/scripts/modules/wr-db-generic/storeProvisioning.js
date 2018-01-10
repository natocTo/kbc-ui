import InstalledComponentStore from '../components/stores/InstalledComponentsStore';

import {Map} from 'immutable';

import * as credentialsTemplate from './templates/credentials';
import _ from 'underscore';

export const connectionErrorPath = ['connection', 'error'];
export const connectionValidPath = ['connection', 'valid'];
export const connectionTestedPath = ['connection', 'tested'];

export const provisionedCredentialsPath = ['credentials', 'o'];

export default function(componentId, configId) {
  const config = InstalledComponentStore.getConfigData(componentId, configId);
  const parameters = config.get('parameters', Map());
  const localState =  InstalledComponentStore.getLocalState(componentId, configId);

  return {
    configData: config,

    isSplashEnabled() {
      return localState.get('isSplashEnabled', false);
    },

    getCredentials() {
      return parameters.get('db', Map());
    },

    hasCredentials() {
      return parameters.has('db');
    },

    getLocalState() {
      return localState;
    },

    getEditingCredentials() {
      return localState.get('editingCredentials', Map());
    },

    hasEditingCredentials() {
      return !!localState.get('editingCredentials');
    },

    isProvCredentialsLoaded(token) {
      return localState.getIn(['provCredentials', token, 'isLoaded'], false);
    },

    isValidCredentials(credentials) {
      if (!credentials) {
        return false;
      }

      const savedCredentials = this.getCredentials();
      const fields = credentialsTemplate.getFields(componentId);

      const isValid = _.reduce(fields, function(memo, field) {
        const propertyName = field[1];
        let value = credentials.get(propertyName, '');
        if (value) {
          value = value.toString();
        }

        const isProtected = credentialsTemplate.getProtectedProperties(componentId).indexOf(propertyName) > -1;
        const isRequired = credentialsTemplate.getRequiredProperties(componentId).indexOf(propertyName) > -1;

        const alreadySaved = !_.isEmpty(savedCredentials.get(propertyName));
        const isValueValid = !isRequired || !_.isEmpty(value) || (isProtected && alreadySaved);

        return memo && isValueValid;
      }, true);

      return isValid;
    },

    isChangedCredentials() {
      return localState.get('isChangedCredentials', false);
    },

    isSavingCredentials() {
      return localState.get('isSavingCredentials', false);
    }
  };
}