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
    const isCompleteFn = settings.getIn(['credentials', 'detail', 'isComplete'], () => true); // todo
    const isChanged = Store.isEditingConfiguration(componentId, configurationId);
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      component: component,
      configurationId: configurationId,
      configurationBySections: Store.getEditingConfiguration(
        componentId,
        configurationId,
        sections.makeParseFn(settings.getIn(['index', 'onLoad']), settings.getIn(['index', 'sections']))
        ),
      isSaving: Store.getPendingActions(componentId, configurationId).has('save-configuration'),
      isChanged: isChanged,
      isComplete: isCompleteFn(Store.getConfiguration(componentId, configurationId))
    };
  },

  renderButtons() {
    const {componentId, configurationId, settings} = this.state;
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={function() {
            return Actions.saveConfiguration(
              componentId,
              configurationId,
              sections.makeCreateFn(settings.getIn(['index', 'onSave']), settings.getIn(['index', 'sections'])),
              sections.makeParseFn(settings.getIn(['index', 'onLoad']), settings.getIn(['index', 'sections'])),
              settings.getIn(['index', 'title'], 'parameters') + ' edited'
            );
          }}
          onReset={function() {
            return Actions.resetConfiguration(componentId, configurationId);
          }}
        />
        <br />
      </div>
    );
  },

  onUpdateSection(sectionKey, diff) {
    const {configurationBySections, componentId, configurationId} = this.state;
    const newConfigurationBySections = configurationBySections.setIn(
      ['sections', sectionKey],
      configurationBySections.getIn(['sections', sectionKey])
                             .merge(Immutable.fromJS(diff)));
    Actions.updateConfiguration(componentId, configurationId, newConfigurationBySections);
  },

  renderSections() {
    const settingsSections = this.state.settings.getIn(['index', 'sections']);
    return settingsSections.map((section, key) => {
      const SectionComponent = section.get('render');
      return (
        <div key={key} className="kbc-inner-content-padding-fix with-bottom-border">
          <SectionComponent
            disabled={false} // todo
            onChange={(diff) => this.onUpdateSection(key, diff)}
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
        {this.renderButtons()}
        {this.renderSections()}
      </span>
    );
  }
});
