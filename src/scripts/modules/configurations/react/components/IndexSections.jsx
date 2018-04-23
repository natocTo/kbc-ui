import React from 'react';
import Immutable from 'immutable';

// stores
import ComponentStore from '../../../components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import Store from '../../ConfigurationsStore';

// actions
import Actions from '../../ConfigurationsActionCreators';

// global components
import SaveButtons from '../../../../react/common/SaveButtons';

// utils
import sections from '../../utils/sections';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const componentId = settings.get('componentId');
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const component = ComponentStore.getComponent(componentId);
    const isChanged = Store.isEditingConfiguration(componentId, configurationId);
    const createBySectionsFn = sections.makeCreateFn(settings.getIn(['index', 'onSave']), settings.getIn(['index', 'sections']));
    const parseBySectionsFn = sections.makeParseFn(settings.getIn(['index', 'onLoad']), settings.getIn(['index', 'sections']));

    const configurationBySections = Store.getEditingConfiguration(
      componentId,
      configurationId,
      parseBySectionsFn
    );

    const isComplete = sections.isComplete(settings.getIn(['index', 'isComplete']), settings.getIn(['index', 'sections']), configurationBySections);
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      component: component,
      configurationId: configurationId,
      createBySectionsFn,
      parseBySectionsFn,
      configurationBySections: configurationBySections,
      isSaving: Store.getPendingActions(componentId, configurationId).has('save-configuration'),
      isChanged: isChanged,
      isComplete: isComplete
    };
  },

  renderButtons() {
    const {componentId, configurationId} = this.state;
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={this.handleSave}
          onReset={() => Actions.resetConfiguration(componentId, configurationId)}
        />
        <br />
      </div>
    );
  },

  handleSave() {
    const {componentId, configurationId, createBySectionsFn, parseBySectionsFn} = this.state;
    return Actions.saveConfiguration(
      componentId,
      configurationId,
      createBySectionsFn,
      parseBySectionsFn,
      'parameters edited'
    );
  },

  onUpdateSection(sectionKey, diff) {
    const {configurationBySections, componentId, configurationId} = this.state;
    const newConfigurationBySections = configurationBySections.setIn(
      ['sections', sectionKey],
      configurationBySections.getIn(['sections', sectionKey])
                             .merge(Immutable.fromJS(diff)));
    const created = this.state.createBySectionsFn(newConfigurationBySections);
    const parsed = this.state.parseBySectionsFn(created);
    return Actions.updateConfiguration(componentId, configurationId, parsed);
  },

  onSaveSection(sectionKey, diff) {
    const {configurationBySections, componentId, configurationId} = this.state;
    const newConfigurationBySections = configurationBySections.setIn(
      ['sections', sectionKey],
      configurationBySections.getIn(['sections', sectionKey])
                             .merge(Immutable.fromJS(diff)));
    const created = this.state.createBySectionsFn(newConfigurationBySections);
    return Actions.saveForcedConfiguration(componentId, configurationId, created);
  },

  renderSections() {
    const settingsSections = this.state.settings.getIn(['index', 'sections']);
    return settingsSections.map((section, key) => {
      const SectionComponent = section.get('render');
      return (
        <div key={key}>
          <SectionComponent
            disabled={this.state.isSaving}
            onChange={(diff) => this.onUpdateSection(key, diff)}
            onSave={(diff) => this.onSaveSection(key, diff)}
            value={this.state.configurationBySections.getIn(['sections', key]).toJS()}
          />
        </div>
      );
    }
    );
  },

  render() {
    return (
      <span>
        {this.renderSections()}
      </span>
    );
  }
});
