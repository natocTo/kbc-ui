import React from 'react';
import {Map} from 'immutable';
import Credentials from './Credentials';
import createStoreMixin from '../../../../../react/mixins/createStoreMixin';
import routesStore from '../../../../../stores/RoutesStore';

export default function(componentId, actionsProvisioning, storeProvisioning, credentialsTemplate, hasSshTunnel) {
  const actionCreators = actionsProvisioning.createActions(componentId);
  return React.createClass({
    mixins: [createStoreMixin(storeProvisioning.componentsStore)],

    getStateFromStores() {
      const config = routesStore.getCurrentRouteParam('config');
      const dbStore = storeProvisioning.createStore(componentId, config);
      const credentials = dbStore.getNewCredentials();
      return {
        configurationId: config,
        credentials: credentials,
        isSaving: dbStore.isSavingCredentials(),
        isValidNewCredentials: dbStore.hasValidCredentials(credentials)
      };
    },

    render() {
      return (
        <Credentials
          configId={this.state.configurationId}
          isValidEditingCredentials={this.state.isValidNewCredentials}
          savedCredentials={Map()}
          credentials={ this.state.credentials }
          isEditing={ !this.state.isSaving }
          onChange={ this.handleChange }
          componentId={componentId}
          credentialsTemplate={credentialsTemplate}
          hasSshTunnel={hasSshTunnel}
          actionsProvisioning={actionsProvisioning}
        />
      );
    },

    handleChange(newCredentials) {
      actionCreators.updateNewCredentials(this.state.configurationId, newCredentials);
    }

  });
}
