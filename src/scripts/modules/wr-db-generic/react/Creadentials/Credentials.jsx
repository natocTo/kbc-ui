import React from 'react';

import SaveButtons from '../../../../react/common/SaveButtons';


// import CredentialsForm from './CredentialsForm';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';

import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
// import WrDbStore from '../../../store';


export default function(componentId, driver, isProvisioning) {
  return React.createClass({
    mixins: [createStoreMixin(InstalledComponentsStore)],

    getStateFromStores() {
      return {
        //@TODO provisioning ma static state
        isProvisioning: isProvisioning,
        isSaving: false,
        isChangedCredentials: true,
        isValidCredentials: true
      };
    },

    handleReset() {

    },

    handleSave() {

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
          </div>
        </div>
      );
    }
  });
}
