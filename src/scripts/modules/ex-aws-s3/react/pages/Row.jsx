import React from 'react';
import Immutable from 'immutable';

// stores
import ConfigurationRowsStore from '../../../components/stores/ConfigurationRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import configurationRowsActions from '../../../components/ConfigurationRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ConfigurationRowDescription from '../../../components/react/components/ConfigurationRowDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import Parameters from '../../../components/react/components/Parameters';
import Processors from '../../../components/react/components/Processors';
import SaveButtons from '../../../../react/common/SaveButtons';
import {Link} from 'react-router';

// adapters
import {isParsableConfiguration, parseConfiguration, createConfiguration} from '../../adapters/row';

// local components
import Configuration from '../components/Configuration';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(ConfigurationRowsStore)],

  getStateFromStores() {
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = ConfigurationRowsStore.get(COMPONENT_ID, configurationId, rowId);
    return {
      configurationId: configurationId,
      rowId: rowId,
      row: row,

      parametersValue: ConfigurationRowsStore.getEditingParametersString(COMPONENT_ID, configurationId, rowId),
      isParametersSaving: ConfigurationRowsStore.getPendingActions(COMPONENT_ID, configurationId, rowId).has('save-parameters'),
      isParametersValid: ConfigurationRowsStore.isEditingParametersValid(COMPONENT_ID, configurationId, rowId),
      isParametersChanged: ConfigurationRowsStore.isEditingParameters(COMPONENT_ID, configurationId, rowId),

      processorsValue: ConfigurationRowsStore.getEditingProcessorsString(COMPONENT_ID, configurationId, rowId),
      isProcessorsSaving: ConfigurationRowsStore.getPendingActions(COMPONENT_ID, configurationId, rowId).has('save-processors'),
      isProcessorsValid: ConfigurationRowsStore.isEditingProcessorsValid(COMPONENT_ID, configurationId, rowId),
      isProcessorsChanged: ConfigurationRowsStore.isEditingProcessors(COMPONENT_ID, configurationId, rowId),

      showJSONEditingFields: !isParsableConfiguration(ConfigurationRowsStore.getConfiguration(COMPONENT_ID, configurationId, rowId)),

      configuration: ConfigurationRowsStore.getEditingConfiguration(COMPONENT_ID, configurationId, rowId, parseConfiguration),
      isSaving: ConfigurationRowsStore.getPendingActions(COMPONENT_ID, configurationId, rowId).has('save-configuration'),
      isChanged: ConfigurationRowsStore.isEditingConfiguration(COMPONENT_ID, configurationId, rowId)
    };
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ConfigurationRowDescription
              componentId={COMPONENT_ID}
              configurationId={this.state.configurationId}
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
              <li>Conditional form fields - disable instead of hide</li>
              <li>Move to trash -> Delete</li>
            </ul>
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            {this.state.showJSONEditingFields ? this.renderJSONEditors() : this.renderForm()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={COMPONENT_ID}
            configurationId={this.state.configurationId}
          />
          <ul className="nav nav-stacked">
            <li>
              <Link to={COMPONENT_ID} params={{config: this.state.configurationId}}>
                <span className="fa fa-arrow-left fa-fw" />
                &nbsp;Back
              </Link>
            </li>
            <li>
              <RunComponentButton
                  title="Run"
                  component={COMPONENT_ID}
                  mode="link"
                  runParams={() => ({config: this.state.configurationId})}
              >
                <span>You are about to run an extraction.</span>
              </RunComponentButton>
            </li>
            <li>
              <DeleteConfigurationButton
                componentId={COMPONENT_ID}
                configurationId={this.state.configurationId}
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
            return configurationRowsActions.saveConfiguration(COMPONENT_ID, state.configurationId, state.rowId, createConfiguration, parseConfiguration);
          }}
          onReset={function() {
            return configurationRowsActions.resetConfiguration(COMPONENT_ID, state.configurationId, state.rowId);
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
      onChange={function(diff) {
        configurationRowsActions.updateConfiguration(COMPONENT_ID, state.configurationId, state.rowId, Immutable.fromJS(configuration.mergeDeep(Immutable.fromJS(diff))));
      }}
      disabled={this.state.isSaving}
      value={configuration.toJS()}
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
          return configurationRowsActions.resetParameters(COMPONENT_ID, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return configurationRowsActions.updateParameters(COMPONENT_ID, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return configurationRowsActions.saveParameters(COMPONENT_ID, state.configurationId, state.rowId);
        }}
      />),
      (<Processors
        isSaving={this.state.isProcessorsSaving}
        value={this.state.processorsValue}
        isEditingValid={this.state.isProcessorsValid}
        isChanged={this.state.isProcessorsChanged}
        onEditCancel={function() {
          return configurationRowsActions.resetProcessors(COMPONENT_ID, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return configurationRowsActions.updateProcessors(COMPONENT_ID, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return configurationRowsActions.saveProcessors(COMPONENT_ID, state.configurationId, state.rowId);
        }}
      />)
    ];
  }
});
