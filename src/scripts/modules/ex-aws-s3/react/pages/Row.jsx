import React from 'react';

// stores
import ConfigRowsStore from '../../../components/stores/ConfigRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import configRowActions from '../../../components/ConfigRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ConfigurationRowDescription from '../../../components/react/components/ConfigurationRowDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import Parameters from '../../../components/react/components/Parameters';
import Processors from '../../../components/react/components/Processors';
import SaveButtons from '../../../../react/common/SaveButtons';

// adapters
import {isParsableConfiguration, parseConfiguration, createConfiguration} from '../../adapters/row';

// local components
import Configuration from '../components/Configuration';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(ConfigRowsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = ConfigRowsStore.get(COMPONENT_ID, configId, rowId);
    return {
      configId: configId,
      rowId: rowId,
      row: row,

      parametersValue: ConfigRowsStore.getEditingParametersString(COMPONENT_ID, configId, rowId),
      isParametersSaving: ConfigRowsStore.getPendingActions(COMPONENT_ID, configId, rowId).has('save-parameters'),
      isParametersValid: ConfigRowsStore.isEditingParametersValid(COMPONENT_ID, configId, rowId),
      isParametersChanged: ConfigRowsStore.isEditingParameters(COMPONENT_ID, configId, rowId),

      processorsValue: ConfigRowsStore.getEditingProcessorsString(COMPONENT_ID, configId, rowId),
      isProcessorsSaving: ConfigRowsStore.getPendingActions(COMPONENT_ID, configId, rowId).has('save-processors'),
      isProcessorsValid: ConfigRowsStore.isEditingProcessorsValid(COMPONENT_ID, configId, rowId),
      isProcessorsChanged: ConfigRowsStore.isEditingProcessors(COMPONENT_ID, configId, rowId),

      showJSONEditingFields: !isParsableConfiguration(ConfigRowsStore.getConfiguration(COMPONENT_ID, configId, rowId)),

      configuration: ConfigRowsStore.getEditingConfiguration(COMPONENT_ID, configId, rowId, parseConfiguration),
      isSaving: ConfigRowsStore.getPendingActions(COMPONENT_ID, configId, rowId).has('save-configuration'),
      isChanged: ConfigRowsStore.isEditingConfiguration(COMPONENT_ID, configId, rowId)
    };
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ConfigurationRowDescription
              componentId={COMPONENT_ID}
              configId={this.state.configId}
              rowId={this.state.rowId}
            />
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <h3>TODO</h3>
            <ul>
              <li>Dummy config for empty state</li>
              <li>JSON editors documentation link / help</li>
              <li>Visual editor & switching</li>
              <li>Unify headlines</li>
              <li>Right bar content</li>
              <li>Form layout</li>
              <li>Conditional form fields</li>
            </ul>
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            {this.state.showJSONEditingFields ? this.renderJSONEditors() : this.renderForm()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={COMPONENT_ID}
            configId={this.state.configId}
          />
          <ul className="nav nav-stacked">
            <li>
              <RunComponentButton
                  title="Run"
                  component={COMPONENT_ID}
                  mode="link"
                  runParams={() => ({config: this.state.configId})}
              >
                <span>You are about to run an extraction.</span>
              </RunComponentButton>
            </li>
            <li>
              <DeleteConfigurationButton
                componentId={COMPONENT_ID}
                configId={this.state.configId}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  },

  renderButtons() {
    const state = this.state;
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={function() {
            return configRowActions.saveConfiguration(COMPONENT_ID, state.configId, state.rowId, createConfiguration, parseConfiguration);
          }}
          onReset={function() {
            return configRowActions.resetConfiguration(COMPONENT_ID, state.configId, state.rowId);
          }}
            />
      </div>
    );
  },

  renderForm() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Configuration
          {this.renderButtons()}
        </h2>
        {this.renderFormFields()}
      </div>
    );
  },

  renderFormFields() {
    const state = this.state;
    const configuration = this.state.configuration;
    return (<Configuration
      onChange={function(value) {
        configRowActions.updateConfiguration(COMPONENT_ID, state.configId, state.rowId, value);
      }}
      disabled={this.state.isSaving}
      value={configuration}
    />);
  },

  renderJSONEditors() {
    const state = this.state;
    return [
      (<Parameters
        isSaving={this.state.isParametersSaving}
        value={this.state.parametersValue}
        isEditingValid={this.state.isParametersValid}
        isChanged={this.state.isParametersChanged}
        onEditCancel={function() {
          return configRowActions.resetParameters(COMPONENT_ID, state.configId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return configRowActions.updateParameters(COMPONENT_ID, state.configId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return configRowActions.saveParameters(COMPONENT_ID, state.configId, state.rowId);
        }}
      />),
      (<Processors
        isSaving={this.state.isProcessorsSaving}
        value={this.state.processorsValue}
        isEditingValid={this.state.isProcessorsValid}
        isChanged={this.state.isProcessorsChanged}
        onEditCancel={function() {
          return configRowActions.resetProcessors(COMPONENT_ID, state.configId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return configRowActions.updateProcessors(COMPONENT_ID, state.configId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return configRowActions.saveProcessors(COMPONENT_ID, state.configId, state.rowId);
        }}
      />)
    ];
  }
});
