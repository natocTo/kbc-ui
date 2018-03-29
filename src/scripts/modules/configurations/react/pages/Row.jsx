import React from 'react';
import Immutable from 'immutable';

// stores
import Store from '../../ConfigurationRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import Actions from '../../ConfigurationRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ConfigurationRowDescription from '../components/ConfigurationRowDescription';
import ConfigurationRowMetadata from '../components/ConfigurationRowMetadata';
import DeleteConfigurationRowButton from '../components/DeleteConfigurationRowButton';
import ResetStateButton from '../components/ResetStateButton';
import JsonConfiguration from '../components/JsonConfiguration';
import SaveButtons from '../../../../react/common/SaveButtons';
import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import LatestRowVersions from '../components/SidebarRowVersionsWrapper';

// adapters
import isParsableConfiguration from '../../utils/isParsableConfiguration';

// styles
import '../../styles.less';

export default React.createClass({
  mixins: [createStoreMixin(Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = Store.get(settings.get('componentId'), configurationId, rowId);
    const isJsonConfigurationValid = Store.isEditingJsonConfigurationValid(settings.get('componentId'), configurationId, rowId);
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      configurationId: configurationId,
      rowId: rowId,
      row: row,

      jsonConfigurationValue: Store.getEditingJsonConfigurationString(settings.get('componentId'), configurationId, rowId),
      isJsonConfigurationSaving: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('save-json'),
      isJsonConfigurationValid: isJsonConfigurationValid,
      isJsonConfigurationChanged: Store.isEditingJsonConfiguration(settings.get('componentId'), configurationId, rowId),
      isJsonConfigurationParsable: isJsonConfigurationValid && isParsableConfiguration(
        Immutable.fromJS(Store.getEditingJsonConfiguration(settings.get('componentId'), configurationId, rowId)),
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
      isResetStatePending: Store.getPendingActions(settings.get('componentId'), configurationId, rowId).has('reset-state')
    };
  },

  renderActions() {
    const state = this.state;
    const settings = this.state.settings;
    let actions = [];
    actions.push((
      <li key="run">
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
    ));
    actions.push((
      <li key="activate">
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
    ));
    if (settings.getIn(['row', 'hasState'])) {
      actions.push((
        <li className={this.state.isResetStatePending || !this.state.hasState ? 'disabled' : ''} key="reset-state">
          <ResetStateButton
            onClick={function() {
              return Actions.resetState(state.componentId, state.configurationId, state.rowId);
            }}
            isPending={this.state.isResetStatePending}
            disabled={!this.state.hasState}
          >Delete the current stored state of the configuration, eg. progress of an incremental
            processes.</ResetStateButton>
        </li>
      ));
    }
    actions.push((
      <li key="delete">
        <DeleteConfigurationRowButton
          onClick={function() {
            const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' deleted';
            return Actions.delete(state.componentId, state.configurationId, state.rowId, true, changeDescription);
          }}
          isPending={this.state.isDeletePending}
          mode="link"
        />
      </li>
    ));
    return actions;
  },

  render() {
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
            {this.state.isJsonEditorOpen || !this.state.isParsableConfiguration ? this.renderJsonEditor() : this.renderForm()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ConfigurationRowMetadata
            componentId={this.state.componentId}
            configurationId={this.state.configurationId}
            rowId={this.state.rowId}
          />
          <ul className="nav nav-stacked">
            {this.renderActions()}
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
    let changedMessage = '';
    if (this.state.isJsonConfigurationChanged || this.state.isChanged) {
      changedMessage = (<p><strong>{'The configuration has unsaved changes.'}</strong></p>);
    }
    if (this.state.row.get('isDisabled')) {
      return (
        <span>
          {changedMessage}
          <p>
            You are about to run {rowName}. Configuration {rowName} is disabled and will be forced to run.
          </p>
        </span>
      );
    } else {
      return (
        <span>
          {changedMessage}
          <p>
            You are about to run {rowName}.
          </p>
        </span>
      );
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

  renderOpenJsonLink() {
    const state = this.state;
    return (
      <small>
        <a onClick={function() {
          Actions.openJsonEditor(state.componentId, state.configurationId, state.rowId);
        }}>
          Open JSON editor
        </a>
        {' '}
        (discards all unsaved changes)
      </small>
    );
  },

  renderCloseJsonLink() {
    const state = this.state;
    if (!this.state.isParsableConfiguration) {
      return (
        <small>Can't close JSON editor, configuration is not compatible. Revert your changes to allow switching back to the visual form.</small>
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
        {this.renderOpenJsonLink()}
        <h2>
          Configuration
        </h2>
        {this.renderButtons()}
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

  renderJsonEditor() {
    const state = this.state;
    const settings = this.state.settings;
    return [
      (<div key="close">{this.renderCloseJsonLink()}</div>),
      (<JsonConfiguration
        key="json-configuration"
        isSaving={this.state.isJsonConfigurationSaving}
        value={this.state.jsonConfigurationValue}
        isEditingValid={this.state.isJsonConfigurationValid}
        isChanged={this.state.isJsonConfigurationChanged}
        onEditCancel={function() {
          return Actions.resetJsonConfiguration(state.componentId, state.configurationId, state.rowId);
        }}
        onEditChange={function(parameters) {
          return Actions.updateJsonConfiguration(state.componentId, state.configurationId, state.rowId, parameters);
        }}
        onEditSubmit={function() {
          const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' configuration edited manually';
          return Actions.saveJsonConfiguration(state.componentId, state.configurationId, state.rowId, changeDescription);
        }}
        showSaveModal={this.state.isParsableConfiguration && !this.state.isJsonConfigurationParsable}
        saveModalTitle="Save Parameters"
        saveModalBody={(<div>The changes in the configuration are not compatible with the original visual form. Saving this configuration will disable the visual representation of the whole configuration and you will be able to edit the configuration in JSON editor only.</div>)}
      />)
    ];
  }
});
