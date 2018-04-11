import React from 'react';

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

    return {
      createBySectionsFn,
      parseBySectionsFn,
      componentId: componentId,
      settings: settings,
      configurationId: configurationId,
      rowId: rowId,
      row: row,
      isSaving: Store.getPendingActions(componentId, configurationId, rowId).has('save-configuration'),
      isChanged: Store.isEditingConfiguration(componentId, configurationId, rowId)
    };
  },

  render() {
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={this.handleSave}
          onReset={this.handleReset}
        />
      </div>
    );
  },

  handleReset() {
    const state = this.state;
    return Actions.resetConfiguration(state.componentId, state.configurationId, state.rowId);
  },

  handleSave() {
    const state = this.state;
    const settings = this.state.settings;
    const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.row.get('name') + ' edited';
    return Actions.saveConfiguration(
      state.componentId,
      state.configurationId,
      state.rowId,
      state.createBySectionsFn,
      state.parseBySectionsFn,
      changeDescription
    );
  }

});
