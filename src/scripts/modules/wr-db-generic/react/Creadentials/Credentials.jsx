import React from 'react';

import {Navigation} from 'react-router';

import {Button} from 'react-bootstrap';
import {Map} from 'immutable';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';

import RoutesStore from '../../../../stores/RoutesStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';

import storeProvisioning from '../../storeProvisioning';
import actionsProvisioning from '../../actionsProvisioning';
import provisioningUtils from '../../provisioningUtils';

import TestCredentialsButton from '../../../../react/common/TestCredentialsButtonGroup';
import SaveButtons from '../../../../react/common/SaveButtons';
import CredentialsForm from './CredentialsForm';
import ProvisionedCredentials from './ProvisionedCredentials';

export default function(componentId, driver, credentialsTemplate, isProvisioning, hasSshTunnel) {
  const WrDbActions = actionsProvisioning(componentId, driver);
  const WrDbProvisioning = provisioningUtils(componentId, driver);

  return React.createClass({
    mixins: [createStoreMixin(InstalledComponentsStore), Navigation],

    getStateFromStores() {
      const configId = RoutesStore.getRouterState().getIn(['params', 'config']);
      const WrDbStore = storeProvisioning(componentId, configId);

      return {
        configId: configId,
        credentials: WrDbStore.getCredentials(),
        isProvisionedCredentilas: WrDbProvisioning.isProvisioningCredentials(WrDbStore.hasEditingCredentials() ? WrDbStore.getEditingCredentials() : WrDbStore.getCredentials()),
        editingCredentials: WrDbStore.getEditingCredentials(),
        isEditing: WrDbStore.hasEditingCredentials(),
        isProvisioning: isProvisioning,
        isSaving: WrDbStore.isSavingCredentials(),
        isChangedCredentials: WrDbStore.isChangedCredentials(),
        isSplashEnabled: WrDbStore.isSplashEnabled(),
        isValidCredentials: WrDbStore.isValidCredentials(WrDbStore.hasEditingCredentials() ? WrDbStore.getEditingCredentials() : WrDbStore.getCredentials())
      };
    },

    handleChange(newCredentials) {
      WrDbActions.updateEditingCredentials(this.state.configId, newCredentials);
    },

    handleClear() {
      WrDbActions.updateEditingCredentials(this.state.configId, Map());
      WrDbActions.enableSplash(this.state.configId);
    },

    handleReset() {
      WrDbActions.cancelCredentialsEdit(this.state.configId);
    },

    handleSplash() {
      WrDbActions.enableSplash(this.state.configId);
      this.transitionTo(
        componentId,
        {config: this.state.configId}
      );
    },

    testCredentials() {
      return WrDbActions.testCredentials(this.state.configId, (this.state.isEditing) ? this.state.editingCredentials : this.state.credentials);
    },

    handleSave() {
      WrDbActions.saveEditingCredentials(this.state.configId);
    },

    render() {
      return (
        <div className="container-fluid">
          <div className="kbc-main-content">
            <div className="kbc-inner-content-padding-fix text-right">
              {
                this.state.isProvisionedCredentilas ?
                  (
                    <Button
                      className="save-button"
                      bsStyle={'link'}
                      disabled={this.state.isSaving}
                      onClick={this.handleSplash}>
                      Reset Credentials
                    </Button>
                  )
                  :
                  (
                    <SaveButtons
                      isSaving={this.state.isSaving}
                      isChanged={this.state.isChangedCredentials || this.state.isSplashEnabled}
                      disabled={this.state.isSaving || !this.state.isValidCredentials}
                      onReset={this.handleReset}
                      onSave={this.handleSave}
                    />
                  )
              }
            </div>
            {
              this.state.isProvisionedCredentilas ?
                (
                  <ProvisionedCredentials
                    componentId={componentId}
                    configId={this.state.configId}
                    credentialsTemplate={credentialsTemplate}
                    credentials={this.state.credentials}
                  />
                )
                :
                (
                  <CredentialsForm
                    componentId={componentId}
                    configId={this.state.configId}
                    credentialsTemplate={credentialsTemplate}
                    hasSshTunnel={hasSshTunnel}
                    credentials={this.state.credentials}
                    editingCredentials={(this.state.isEditing) ? this.state.editingCredentials : this.state.credentials}
                    enabled={!this.state.isSaving}
                    onChange={this.handleChange}
                  />
                )
            }
            <div className="form-group">
              <div className="col-xs-8 col-xs-offset-4">
                <Button
                  bsStyle="btn btn-link"
                  onClick={this.handleSplash}>
                  <span className="fa fa-fw fa-times" /> Reset Credentials
                </Button>
              </div>
            </div>
            <TestCredentialsButton
              componentId={componentId}
              configId={this.state.configId}
              isEditing={this.state.isEditing}
              testCredentialsFn={this.testCredentials}
              disabled={this.state.isSaving || !this.state.isValidCredentials}
            />
          </div>
        </div>
      );
    }
  });
}
