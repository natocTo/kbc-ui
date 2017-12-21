import React from 'react';
import Immutable from 'immutable';

// stores
import Store from '../../../components/stores/ConfigurationRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import Actions from '../../../components/ConfigurationRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ConfigurationRowDescription from '../../../components/react/components/ConfigurationRowDescription';
import ConfigurationRowMetadata from '../../../components/react/components/ConfigurationRowMetadata';
import DeleteConfigurationRowButton from '../../../components/react/components/DeleteConfigurationRowButton';
import Parameters from '../../../components/react/components/Parameters';
import Processors from '../../../components/react/components/Processors';
import SaveButtons from '../../../../react/common/SaveButtons';
import {Link} from 'react-router';
import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';

// adapters
import {parseConfiguration, createConfiguration} from '../../adapters/row';
import isParsableConfiguration from '../../adapters/isParsableConfiguration';

// local components
import Configuration from '../components/Configuration';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = Store.get(COMPONENT_ID, configurationId, rowId);
    return {
      configurationId: configurationId,
      rowId: rowId,
      row: row,

      parametersValue: Store.getEditingParametersString(COMPONENT_ID, configurationId, rowId),
      isParametersSaving: Store.getPendingActions(COMPONENT_ID, configurationId, rowId).has('save-parameters'),
      isParametersValid: Store.isEditingParametersValid(COMPONENT_ID, configurationId, rowId),
      isParametersChanged: Store.isEditingParameters(COMPONENT_ID, configurationId, rowId),

      processorsValue: Store.getEditingProcessorsString(COMPONENT_ID, configurationId, rowId),
      isProcessorsSaving: Store.getPendingActions(COMPONENT_ID, configurationId, rowId).has('save-processors'),
      isProcessorsValid: Store.isEditingProcessorsValid(COMPONENT_ID, configurationId, rowId),
      isProcessorsChanged: Store.isEditingProcessors(COMPONENT_ID, configurationId, rowId),

      isParsableConfiguration: isParsableConfiguration(Store.getConfiguration(COMPONENT_ID, configurationId, rowId), parseConfiguration, createConfiguration),
      isJsonEditorOpen: Store.hasJsonEditor(COMPONENT_ID, configurationId, rowId),

      configuration: Store.getEditingConfiguration(COMPONENT_ID, configurationId, rowId, parseConfiguration),
      isSaving: Store.getPendingActions(COMPONENT_ID, configurationId, rowId).has('save-configuration'),
      isChanged: Store.isEditingConfiguration(COMPONENT_ID, configurationId, rowId),

      isDeletePending: Store.getPendingActions(COMPONENT_ID, configurationId, rowId).has('delete'),
      isEnableDisablePending: Store.getPendingActions(COMPONENT_ID, configurationId, rowId).has('enable') || Store.getPendingActions(COMPONENT_ID, configurationId, rowId).has('disable')
    };
  },

  render() {
    const state = this.state;
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ConfigurationRowDescription
              componentId={COMPONENT_ID}
              configId={this.state.configurationId}
              rowId={this.state.rowId}
            />
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            {this.state.isJsonEditorOpen || !this.state.isParsableConfiguration ? this.renderJSONEditors() : this.renderForm()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ConfigurationRowMetadata
            componentId={COMPONENT_ID}
            configurationId={this.state.configurationId}
            rowId={this.state.rowId}
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
                  runParams={function() {
                    return {
                      config: state.configurationId,
                      row: state.rowId
                    };
                  }}
              >
                {this.renderRunModalContent()}
              </RunComponentButton>
            </li>
            <li>
              <ActivateDeactivateButton
                key="activate"
                activateTooltip="Enable"
                deactivateTooltip="Disable"
                activateLabel="Enable"
                deactivateLabel="Disable"
                isActive={!this.state.row.get('isDisabled', false)}
                isPending={this.state.isEnableDisablePending}
                onChange={function() {
                  if (state.row.get('isDisabled', false)) {
                    return Actions.enable(COMPONENT_ID, state.configurationId, state.rowId);
                  } else {
                    return Actions.disable(COMPONENT_ID, state.configurationId, state.rowId);
                  }
                }}
                mode="link"
              />
            </li>
            <li>
              <DeleteConfigurationRowButton
                onClick={function() {
                  return Actions.delete(COMPONENT_ID, state.configurationId, state.rowId, true);
                }}
                isPending={this.state.isDeletePending}
                mode="link"
              />
            </li>
          </ul>
        </div>
      </div>
    );
  },

  renderRunModalContent() {
    const rowName = this.state.row.get('name', 'Untitled');
    if (this.state.row.get('isDisabled')) {
      return 'You are about to run ' + rowName + '. Configuration ' + rowName + ' is disabled and will be forced to run ';
    } else {
      return 'You are about to run ' + rowName + '.';
    }
  },

  renderButtons() {
    const state = this.state;
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={function() {
            return Actions.saveConfiguration(COMPONENT_ID, state.configurationId, state.rowId, createConfiguration, parseConfiguration);
          }}
          onReset={function() {
            return Actions.resetConfiguration(COMPONENT_ID, state.configurationId, state.rowId);
          }}
            />
      </div>
    );
  },

  renderOpenJSONLink() {
    const state = this.state;
    return (
      <span style={{marginLeft: '10px'}}>
        <small>
          <a onClick={function() {
            Actions.openJsonEditor(COMPONENT_ID, state.configurationId, state.rowId);
          }}>
            Open JSON
          </a>
          {' '}
          (discards all unsaved changes)
        </small>
      </span>
    );
  },

  renderCloseJSONLink() {
    const state = this.state;
    if (!this.state.isParsableConfiguration) {
      return (
        <small>Can't switch back to visual form, configuration is not compatible.</small>
      );
    }
    return (
      <small>
        <a onClick={function() {
          Actions.closeJsonEditor(COMPONENT_ID, state.configurationId, state.rowId);
        }}>
          Close JSON
        </a>
        {' '}
        (discards all unsaved changes)
      </small>
    );
  },


  renderForm() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Configuration
          {this.renderOpenJSONLink()}
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
        Actions.updateConfiguration(COMPONENT_ID, state.configurationId, state.rowId, configuration.merge(Immutable.fromJS(diff)));
      }}
      disabled={this.state.isSaving}
      value={configuration.toJS()}
    />);
  },

  renderJSONEditors() {
    const state = this.state;
    return [
      (<div key="close">{this.renderCloseJSONLink()}</div>),
      (<Parameters
        key="parameters"
        isSaving={this.state.isParametersSaving}
        value={this.state.parametersValue}
        isEditingValid={this.state.isParametersValid}
        isChanged={this.state.isParametersChanged}
        onEditCancel={function() {
          return Actions.resetParameters(COMPONENT_ID, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateParameters(COMPONENT_ID, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return Actions.saveParameters(COMPONENT_ID, state.configurationId, state.rowId);
        }}
      />),
      (<Processors
        key="processors"
        isSaving={this.state.isProcessorsSaving}
        value={this.state.processorsValue}
        isEditingValid={this.state.isProcessorsValid}
        isChanged={this.state.isProcessorsChanged}
        onEditCancel={function() {
          return Actions.resetProcessors(COMPONENT_ID, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateProcessors(COMPONENT_ID, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return Actions.saveProcessors(COMPONENT_ID, state.configurationId, state.rowId);
        }}
      />)
    ];
  }
});
