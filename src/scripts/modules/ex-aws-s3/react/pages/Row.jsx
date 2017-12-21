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

export default React.createClass({
  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    const componentId = RoutesStore.getRouteComponentId();
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = Store.get(componentId, configurationId, rowId);
    return {
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      row: row,

      parametersValue: Store.getEditingParametersString(componentId, configurationId, rowId),
      isParametersSaving: Store.getPendingActions(componentId, configurationId, rowId).has('save-parameters'),
      isParametersValid: Store.isEditingParametersValid(componentId, configurationId, rowId),
      isParametersChanged: Store.isEditingParameters(componentId, configurationId, rowId),

      processorsValue: Store.getEditingProcessorsString(componentId, configurationId, rowId),
      isProcessorsSaving: Store.getPendingActions(componentId, configurationId, rowId).has('save-processors'),
      isProcessorsValid: Store.isEditingProcessorsValid(componentId, configurationId, rowId),
      isProcessorsChanged: Store.isEditingProcessors(componentId, configurationId, rowId),

      isParsableConfiguration: isParsableConfiguration(Store.getConfiguration(componentId, configurationId, rowId), parseConfiguration, createConfiguration),
      isJsonEditorOpen: Store.hasJsonEditor(componentId, configurationId, rowId),

      configuration: Store.getEditingConfiguration(componentId, configurationId, rowId, parseConfiguration),
      isSaving: Store.getPendingActions(componentId, configurationId, rowId).has('save-configuration'),
      isChanged: Store.isEditingConfiguration(componentId, configurationId, rowId),

      isDeletePending: Store.getPendingActions(componentId, configurationId, rowId).has('delete'),
      isEnableDisablePending: Store.getPendingActions(componentId, configurationId, rowId).has('enable') || Store.getPendingActions(componentId, configurationId, rowId).has('disable')
    };
  },

  render() {
    const state = this.state;
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ConfigurationRowDescription
              componentId={this.state.componentId}
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
            componentId={this.state.componentId}
            configurationId={this.state.configurationId}
            rowId={this.state.rowId}
          />
          <ul className="nav nav-stacked">
            <li>
              <Link to={this.state.componentId} params={{config: this.state.configurationId}}>
                <span className="fa fa-arrow-left fa-fw" />
                &nbsp;Back
              </Link>
            </li>
            <li>
              <RunComponentButton
                  title="Run"
                  component={this.state.componentId}
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
                    return Actions.enable(this.state.componentId, state.configurationId, state.rowId);
                  } else {
                    return Actions.disable(this.state.componentId, state.configurationId, state.rowId);
                  }
                }}
                mode="link"
              />
            </li>
            <li>
              <DeleteConfigurationRowButton
                onClick={function() {
                  return Actions.delete(this.state.componentId, state.configurationId, state.rowId, true);
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
            return Actions.saveConfiguration(this.state.componentId, state.configurationId, state.rowId, createConfiguration, parseConfiguration);
          }}
          onReset={function() {
            return Actions.resetConfiguration(this.state.componentId, state.configurationId, state.rowId);
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
            Actions.openJsonEditor(this.state.componentId, state.configurationId, state.rowId);
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
          Actions.closeJsonEditor(this.state.componentId, state.configurationId, state.rowId);
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
        Actions.updateConfiguration(this.state.componentId, state.configurationId, state.rowId, configuration.merge(Immutable.fromJS(diff)));
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
          return Actions.resetParameters(this.state.componentId, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateParameters(this.state.componentId, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return Actions.saveParameters(this.state.componentId, state.configurationId, state.rowId);
        }}
      />),
      (<Processors
        key="processors"
        isSaving={this.state.isProcessorsSaving}
        value={this.state.processorsValue}
        isEditingValid={this.state.isProcessorsValid}
        isChanged={this.state.isProcessorsChanged}
        onEditCancel={function() {
          return Actions.resetProcessors(this.state.componentId, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateProcessors(this.state.componentId, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          return Actions.saveProcessors(this.state.componentId, state.configurationId, state.rowId);
        }}
      />)
    ];
  }
});
