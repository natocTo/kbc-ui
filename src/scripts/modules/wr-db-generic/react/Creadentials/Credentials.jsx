import React from 'react';

import RoutesStore from '../../../../stores/RoutesStore';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';

import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';

import storeProvisioning from '../../storeProvisioning';
import actionsProvisioning from '../../actionsProvisioning';

import SaveButtons from '../../../../react/common/SaveButtons';
import CredentialsForm from './CredentialsForm';

export default function(componentId, driver, credentialsTemplate, isProvisioning) {
  const WrDbActions = actionsProvisioning(componentId);

  return React.createClass({
    mixins: [createStoreMixin(InstalledComponentsStore)],

    getStateFromStores() {
      const configId = RoutesStore.getRouterState().getIn(['params', 'config']);
      const WrDbStore = storeProvisioning(componentId, configId);

      return {
        configId: configId,
        credentials: WrDbStore.getCredentials(),
        editingCredentials: WrDbStore.getEditingCredentials(),
        isEditing: WrDbStore.hasEditingCredentials(),
        isProvisioning: isProvisioning,
        isSaving: WrDbStore.isSavingCredentials(),
        isChangedCredentials: WrDbStore.isChangedCredentials(),
        isValidCredentials: WrDbStore.isValidCredentials(WrDbStore.hasEditingCredentials() ? WrDbStore.getEditingCredentials() : WrDbStore.getCredentials())
      };
    },

    handleChange(newCredentials) {
      WrDbActions.updateEditingCredentials(this.state.configId, newCredentials);
    },

    handleReset() {
      WrDbActions.cancelCredentialsEdit(this.state.configId);
    },

    handleSave() {
      WrDbActions.saveEditingCredentials(this.state.configId);
    },

    render() {
      return (
        <div className="container-fluid">
          <div className="kbc-main-content">
            <div className="kbc-inner-content-padding-fix text-right">
              <SaveButtons
                isSaving={this.state.isSaving}
                isChanged={this.state.isChangedCredentials}
                disabled={this.state.isSaving || !this.state.isValidCredentials}
                onReset={this.handleReset}
                onSave={this.handleSave}
              />
            </div>
            <CredentialsForm
              componentId={componentId}
              configId={this.state.configId}
              credentialsTemplate={credentialsTemplate}
              credentials={this.state.credentials}
              editingCredentials={(this.state.isEditing) ? this.state.editingCredentials : this.state.credentials}
              enabled={!this.state.isSaving}
              onChange={this.handleChange}
            />
          </div>
        </div>
      );
    }
  });
}
