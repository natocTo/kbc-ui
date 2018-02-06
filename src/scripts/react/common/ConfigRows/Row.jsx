import React from 'react';
import Immutable from 'immutable';

// stores
import Store from '../../../modules/components/stores/ConfigurationRowsStore';
import RoutesStore from '../../../stores/RoutesStore';
import createStoreMixin from '../../mixins/createStoreMixin';

// actions
import Actions from '../../../modules/components/ConfigurationRowsActionCreators';

// global components
import RunComponentButton from '../../../modules/components/react/components/RunComponentButton';
import ConfigurationRowDescription from '../../../modules/components/react/components/ConfigurationRowDescription';
import ConfigurationRowMetadata from '../../../modules/components/react/components/ConfigurationRowMetadata';
import DeleteConfigurationRowButton from '../../../modules/components/react/components/DeleteConfigurationRowButton';
import ResetStateButton from '../../../modules/components/react/components/ResetStateButton';
import Parameters from '../../../modules/components/react/components/Parameters';
import Processors from '../../../modules/components/react/components/Processors';
import SaveButtons from '../SaveButtons';
import ActivateDeactivateButton from '../ActivateDeactivateButton';
import LatestRowVersions from '../../../modules/components/react/components/SidebarRowVersionsWrapper';

// adapters
import isParsableConfiguration from '../../../utils/isParsableConfiguration';

export default React.createClass({
  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = Store.get(settings.get('componentId'), configurationId, rowId);
    const isCompletedFn = settings.getIn(['row', 'detail', 'isCompleted']);
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      configurationId: configurationId,
      rowId: rowId,
      row: row,

      parametersValue: Store.getEditingParametersString(settings.get('componentId'), configurationId, rowId),
      isParametersSaving: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('save-parameters'),
      isParametersValid: Store.isEditingParametersValid(settings.get('componentId'), configurationId, rowId),
      isParametersChanged: Store.isEditingParameters(settings.get('componentId'), configurationId, rowId),
      isParametersParsable: isParsableConfiguration(
        Store.getConfiguration(settings.get('componentId'), configurationId, rowId).set('parameters', Immutable.fromJS(Store.getEditingParameters(settings.get('componentId'), configurationId, rowId))),
        settings.getIn(['row', 'detail', 'onLoad']),
        settings.getIn(['row', 'detail', 'onSave'])
      ),

      processorsValue: Store.getEditingProcessorsString(settings.get('componentId'), configurationId, rowId),
      isProcessorsSaving: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('save-processors'),
      isProcessorsValid: Store.isEditingProcessorsValid(settings.get('componentId'), configurationId, rowId),
      isProcessorsChanged: Store.isEditingProcessors(settings.get('componentId'), configurationId, rowId),
      isProcessorsParsable: isParsableConfiguration(
        Store.getConfiguration(settings.get('componentId'), configurationId, rowId).set('processors', Immutable.fromJS(Store.getEditingProcessors(settings.get('componentId'), configurationId, rowId))),
        settings.getIn(['row', 'detail', 'onLoad']),
        settings.getIn(['row', 'detail', 'onSave'])
      ),

      isParsableConfiguration: isParsableConfiguration(
        Store.getConfiguration(settings.get('componentId'), configurationId, rowId),
        settings.getIn(['row', 'detail', 'onLoad']),
        settings.getIn(['row', 'detail', 'onSave'])
      ),
      isJsonEditorOpen: Store.hasJsonEditor(
        settings.get('componentId'),
        configurationId,
        rowId,
        settings.getIn(['row', 'detail', 'onLoad']),
        settings.getIn(['row', 'detail', 'onSave'])
      ),

      configuration: Store.getEditingConfiguration(
        settings.get('componentId'),
        configurationId,
        rowId,
        settings.getIn(['row', 'detail', 'onLoad'])
      ),
      isSaving: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('save-configuration'),
      isChanged: Store.isEditingConfiguration(settings.get('componentId'), configurationId, rowId),

      isDeletePending: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('delete'),
      isEnableDisablePending: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('enable') || Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('disable'),

      hasState: !Store.get(settings.get('componentId'), configurationId, rowId).get('state', Immutable.Map()).isEmpty(),
      isResetStatePending: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('reset-state'),

      isConfigurationCompleted: isCompletedFn(Store.getConfiguration(
        settings.get('componentId'),
        configurationId,
        rowId
      ))
    };
  },

  render() {
    const state = this.state;
    const settings = this.state.settings;
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
            <li className={!this.state.isConfigurationCompleted ? 'disabled' : ''}>
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
                  disabled={!this.state.isConfigurationCompleted}
                  disabledReason="Configuration not complete"
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
                    const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' enabled';
                    return Actions.enable(state.componentId, state.configurationId, state.rowId, changeDescription);
                  } else {
                    const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' disabled';
                    return Actions.disable(state.componentId, state.configurationId, state.rowId, changeDescription);
                  }
                }}
                mode="link"
              />
            </li>
            <li className={this.state.isResetStatePending || !this.state.hasState ? 'disabled' : ''}>
              <ResetStateButton
                onClick={function() {
                  return Actions.resetState(state.componentId, state.configurationId, state.rowId);
                }}
                isPending={this.state.isResetStatePending}
                disabled={!this.state.hasState}
              >Delete the current stored state of the configuration, eg. progress of an incremental processes.</ResetStateButton>
            </li>
            <li>
              <DeleteConfigurationRowButton
                onClick={function() {
                  const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' deleted';
                  return Actions.delete(state.componentId, state.configurationId, state.rowId, true, changeDescription);
                }}
                isPending={this.state.isDeletePending}
                mode="link"
              />
            </li>
          </ul>
          <LatestRowVersions
            componentId={this.state.componentId}
            configId={this.state.configurationId}
            rowId={this.state.rowId}
          />
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
    const settings = this.state.settings;
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={function() {
            const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' edited';
            return Actions.saveConfiguration(
              state.componentId,
              state.configurationId,
              state.rowId,
              state.settings.getIn(['row', 'detail', 'onSave']),
              state.settings.getIn(['row', 'detail', 'onLoad']),
              changeDescription
            );
          }}
          onReset={function() {
            return Actions.resetConfiguration(state.componentId, state.configurationId, state.rowId);
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
            Actions.openJsonEditor(state.componentId, state.configurationId, state.rowId);
          }}>
            Open JSON editor
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
        <small>Can't close JSON editor, configuration is not compatible.</small>
      );
    }
    return (
      <small>
        <a onClick={function() {
          Actions.closeJsonEditor(state.componentId, state.configurationId, state.rowId);
        }}>
          Close JSON editor
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
    const Configuration = this.state.settings.getIn(['row', 'detail', 'render']);
    return (<Configuration
      onChange={function(diff) {
        Actions.updateConfiguration(state.componentId, state.configurationId, state.rowId, configuration.merge(Immutable.fromJS(diff)));
      }}
      disabled={this.state.isSaving}
      value={configuration.toJS()}
    />);
  },

  renderJSONEditors() {
    const state = this.state;
    const settings = this.state.settings;
    return [
      (<div key="close">{this.renderCloseJSONLink()}</div>),
      (<Parameters
        key="parameters"
        isSaving={this.state.isParametersSaving}
        value={this.state.parametersValue}
        isEditingValid={this.state.isParametersValid}
        isChanged={this.state.isParametersChanged}
        onEditCancel={function() {
          return Actions.resetParameters(state.componentId, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateParameters(state.componentId, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' parameters edited manually';
          return Actions.saveParameters(state.componentId, state.configurationId, state.rowId, changeDescription);
        }}
        showSaveModal={this.state.isParsableConfiguration && !this.state.isParametersParsable}
        saveModalTitle="Save Parameters"
        saveModalBody={(<div>The changes in configuration parameters are not compatible with the original visual form. Saving these parameters will disable the visual representation of the whole configuration and you will be able to edit the configuration in JSON only.</div>)}
      />),
      (<Processors
        key="processors"
        isSaving={this.state.isProcessorsSaving}
        value={this.state.processorsValue}
        isEditingValid={this.state.isProcessorsValid}
        isChanged={this.state.isProcessorsChanged}
        onEditCancel={function() {
          return Actions.resetProcessors(state.componentId, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateProcessors(state.componentId, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' processors edited manually';
          return Actions.saveProcessors(state.componentId, state.configurationId, state.rowId, changeDescription);
        }}
        showSaveModal={this.state.isParsableConfiguration && !this.state.isProcessorsParsable}
        saveModalTitle="Save Processors"
        saveModalBody={(<div>The changes in processors configuration are not compatible with the original visual form. Saving these processors configuration will disable the visual representation of the whole configuration and you will be able to edit the configuration in JSON only.</div>)}
      />)
    ];
  }
});
