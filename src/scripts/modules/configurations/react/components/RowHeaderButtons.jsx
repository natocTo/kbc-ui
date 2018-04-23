import React from 'react';
import Immutable from 'immutable';

// stores
import Store from '../../ConfigurationRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';

// actions
import Actions from '../../ConfigurationRowsActionCreators';

// components
import SaveButtons from '../../../../react/common/SaveButtons';

// utils
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import sections from '../../utils/sections';
import isParsableConfiguration from '../../utils/isParsableConfiguration';

export default React.createClass({

  mixins: [createStoreMixin(Store)],
  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const componentId = settings.get('componentId');
    const row = Store.get(componentId, configurationId, rowId);
    const createBySectionsFn = sections.makeCreateFn(settings.getIn(['row', 'onSave']), settings.getIn(['row', 'sections']));
    const parseBySectionsFn = sections.makeParseFn(settings.getIn(['row', 'onLoad']), settings.getIn(['row', 'sections']));

    const configurationBySections = Store.getEditingConfiguration(
      componentId,
      configurationId,
      rowId,
      parseBySectionsFn
    );

    const isComplete = sections.isComplete(settings.getIn(['row', 'isComplete']), settings.getIn(['row', 'sections']), configurationBySections);

    // json editor state
    const isJsonEditorOpen = Store.hasJsonEditor(
      componentId,
      configurationId,
      rowId,
      parseBySectionsFn,
      createBySectionsFn
    ) || !isParsableConfiguration(
      Store.getConfiguration(componentId, configurationId, rowId),
      parseBySectionsFn,
      createBySectionsFn
    );

    const isJsonConfigurationSaving = isJsonEditorOpen && Store.getPendingActions(componentId, configurationId, rowId).has('save-json');
    const isJsonConfigurationValid = isJsonEditorOpen && Store.isEditingJsonConfigurationValid(componentId, configurationId, rowId);

    const isJsonConfigurationChanged = isJsonEditorOpen && Store.isEditingJsonConfiguration(componentId, configurationId, rowId);

    const isJsonConfigurationParsable = isJsonConfigurationValid && isParsableConfiguration(
      Immutable.fromJS(Store.getEditingJsonConfiguration(componentId, configurationId, rowId)),
      parseBySectionsFn,
      createBySectionsFn
    );

    return {
      showModal: isJsonEditorOpen && !isJsonConfigurationParsable,
      isJsonEditorOpen,
      isComplete: isComplete || !isJsonConfigurationValid,
      createBySectionsFn,
      parseBySectionsFn,
      componentId: componentId,
      settings: settings,
      configurationId: configurationId,
      rowId: rowId,
      row: row,
      isSaving: Store.getPendingActions(componentId, configurationId, rowId).has('save-configuration') || isJsonConfigurationSaving,
      isChanged: Store.isEditingConfiguration(componentId, configurationId, rowId) || isJsonConfigurationChanged
    };
  },

  render() {
    return (
      <div className="text-right">
        <SaveButtons
          disabled={!this.state.isComplete}
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={this.handleSave}
          onReset={this.handleReset}
          showModal={this.state.showModal}
          modalTitle="Save Parameters"
          modalBody={(<div>The changes in the configuration are not compatible with the original visual form. Saving this configuration will disable the visual representation of the whole configuration and you will be able to edit the configuration in JSON editor only.</div>)}
        />
      </div>
    );
  },

  handleReset() {
    const state = this.state;
    if (state.isJsonEditorOpen) {
      return Actions.resetJsonConfiguration(state.componentId, state.configurationId, state.rowId);
    } else {
      return Actions.resetConfiguration(state.componentId, state.configurationId, state.rowId);
    }
  },

  handleSave() {
    const state = this.state;
    const {isJsonEditorOpen} = this.state;
    const settings = this.state.settings;
    const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + (isJsonEditorOpen ? ' configuration edited manually' : ' edited');

    if (isJsonEditorOpen) {
      return Actions.saveJsonConfiguration(state.componentId, state.configurationId, state.rowId, changeDescription);
    } else {
      return Actions.saveConfiguration(
        state.componentId,
        state.configurationId,
        state.rowId,
        state.createBySectionsFn,
        state.parseBySectionsFn,
        changeDescription
      );
    }
  }

});
