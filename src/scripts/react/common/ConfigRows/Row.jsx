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
import Parameters from '../../../modules/components/react/components/Parameters';
import Processors from '../../../modules/components/react/components/Processors';
import SaveButtons from '../SaveButtons';
import { Link } from 'react-router';
import ActivateDeactivateButton from '../ActivateDeactivateButton';

// adapters
import isParsableConfiguration from '../../../utils/isParsableConfiguration';

export default React.createClass({
  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = Store.get(settings.get('componentId'), configurationId, rowId);
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

      processorsValue: Store.getEditingProcessorsString(settings.get('componentId'), configurationId, rowId),
      isProcessorsSaving: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('save-processors'),
      isProcessorsValid: Store.isEditingProcessorsValid(settings.get('componentId'), configurationId, rowId),
      isProcessorsChanged: Store.isEditingProcessors(settings.get('componentId'), configurationId, rowId),

      isParsableConfiguration: isParsableConfiguration(
        Store.getConfiguration(settings.get('componentId'), configurationId, rowId),
        settings.getIn(['adapters', 'row', 'parse']),
        settings.getIn(['adapters', 'row', 'create'])
      ),
      isJsonEditorOpen: Store.hasJsonEditor(
        settings.get('componentId'),
        configurationId,
        rowId,
        settings.getIn(['adapters', 'row', 'parse']),
        settings.getIn(['adapters', 'row', 'create'])
      ),

      configuration: Store.getEditingConfiguration(
        settings.get('componentId'),
        configurationId,
        rowId,
        settings.getIn(['adapters', 'row', 'parse'])
      ),
      isSaving: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('save-configuration'),
      isChanged: Store.isEditingConfiguration(settings.get('componentId'), configurationId, rowId),

      isDeletePending: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('delete'),
      isEnableDisablePending: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('enable') || Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('disable')
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
            TODO
            <ul><li>Reset State button</li></ul>
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
                    return Actions.enable(state.componentId, state.configurationId, state.rowId);
                  } else {
                    return Actions.disable(state.componentId, state.configurationId, state.rowId);
                  }
                }}
                mode="link"
              />
            </li>
            <li>
              <DeleteConfigurationRowButton
                onClick={function() {
                  return Actions.delete(state.componentId, state.configurationId, state.rowId, true);
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
            return Actions.saveConfiguration(
              state.componentId,
              state.configurationId,
              state.rowId,
              state.settings.getIn(['adapters', 'row', 'create']),
              state.settings.getIn(['adapters', 'row', 'parse'])
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
          Actions.closeJsonEditor(state.componentId, state.configurationId, state.rowId);
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
    const Configuration = this.state.settings.getIn(['components', 'row']);
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
          return Actions.saveParameters(state.componentId, state.configurationId, state.rowId);
        }}
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
          return Actions.saveProcessors(state.componentId, state.configurationId, state.rowId);
        }}
      />)
    ];
  }
});
