import React from 'react';
import Immutable from 'immutable';

// stores
import ComponentStore from '../../../components/stores/ComponentsStore';
import ConfigurationsStore from '../../ConfigurationsStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import Store from '../../ConfigurationsStore';

// actions
import Actions from '../../ConfigurationsActionCreators';

// utils
import sections from '../../utils/sections';
import isParsableConfiguration from '../../utils/isParsableConfiguration';

import JsonConfiguration from '../components/JsonConfiguration';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const componentId = settings.get('componentId');
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const component = ComponentStore.getComponent(componentId);
    const isChanged = Store.isEditingConfiguration(componentId, configurationId);
    const context = ConfigurationsStore.getConfigurationContext(componentId, configurationId);
    const createBySectionsFn = sections.makeCreateFn(settings.getIn(['index', 'sections']));
    const conformFn = settings.getIn(['index', 'onConform'], (config) => config);
    const parseBySectionsFn = sections.makeParseFn(
      settings.getIn(['index', 'sections']),
      conformFn,
      context
    );

    const configurationBySections = Store.getEditingConfiguration(
      componentId,
      configurationId,
      parseBySectionsFn
    );

    const isJsonConfigurationValid = Store.isEditingJsonConfigurationValid(componentId, configurationId);

    const storedConfigurationSections = parseBySectionsFn(Store.getConfiguration(componentId, configurationId));

    return {
      storedConfigurationSections,
      componentId: settings.get('componentId'),
      settings: settings,
      component: component,
      configurationId: configurationId,
      createBySectionsFn,
      parseBySectionsFn,
      jsonConfigurationValue: Store.getEditingJsonConfigurationString(componentId, configurationId),
      isJsonConfigurationSaving: Store.getPendingActions(componentId, configurationId).has('save-json'),
      isJsonConfigurationValid: isJsonConfigurationValid,
      isJsonConfigurationChanged: Store.isEditingJsonConfiguration(componentId, configurationId),
      isJsonConfigurationParsable:
        isJsonConfigurationValid &&
        isParsableConfiguration(
          conformFn(Immutable.fromJS(Store.getEditingJsonConfiguration(componentId, configurationId))),
          parseBySectionsFn,
          createBySectionsFn
        ),

      isParsableConfiguration: isParsableConfiguration(
        conformFn(Store.getConfiguration(componentId, configurationId)),
        parseBySectionsFn,
        createBySectionsFn
      ),
      isJsonEditorOpen: Store.hasJsonEditor(componentId, configurationId, parseBySectionsFn, createBySectionsFn, conformFn),
      configurationBySections: configurationBySections,
      isSaving: Store.getPendingActions(componentId, configurationId).has('save-configuration'),
      isChanged: isChanged

    };
  },

  onUpdateSection(sectionKey, diff) {
    const {configurationBySections, componentId, configurationId} = this.state;
    const newConfigurationBySections = configurationBySections.set(
      sectionKey,
      configurationBySections.get(sectionKey)
        .merge(Immutable.fromJS(diff)));
    const created = this.state.createBySectionsFn(newConfigurationBySections);
    const parsed = this.state.parseBySectionsFn(created);
    return Actions.updateConfiguration(componentId, configurationId, parsed);
  },

  onSaveSection(sectionKey, diff) {
    const {configurationBySections, componentId, configurationId} = this.state;
    const newConfigurationBySections = configurationBySections.set(
      sectionKey,
      configurationBySections.get(sectionKey)
        .merge(Immutable.fromJS(diff)));
    const created = this.state.createBySectionsFn(newConfigurationBySections);
    return Actions.saveForcedConfiguration(componentId, configurationId, created);
  },

  renderSections() {
    const settingsSections = this.state.settings.getIn(['index', 'sections']);
    const {storedConfigurationSections} = this.state;
    const returnTrue = () => true;
    return settingsSections.map((section, key) => {
      const SectionComponent = section.get('render');
      const onSectionSave = section.get('onSave');
      const sectionIsCompleteFn = section.get('isComplete') || returnTrue;
      const isComplete = sectionIsCompleteFn(onSectionSave(storedConfigurationSections.get(key)));
      return (
        <div key={key}>
          <SectionComponent
            isComplete={isComplete}
            disabled={this.state.isSaving}
            onChange={(diff) => this.onUpdateSection(key, diff)}
            onSave={(diff) => this.onSaveSection(key, diff)}
            value={this.state.configurationBySections.get(key).toJS()}
          />
        </div>
      );
    }
    );
  },

  renderForm() {
    return (
      <div>
        <div className="kbc-inner-padding">
          {this.renderOpenJsonLink()}
        </div>
        {this.renderSections()}
      </div>
    );
  },

  renderJsonEditor() {
    const state = this.state;
    return [
      <div key="close">{this.renderCloseJsonLink()}</div>,
      <JsonConfiguration
        key="json-configuration"
        isSaving={this.state.isJsonConfigurationSaving}
        value={this.state.jsonConfigurationValue}
        isEditingValid={this.state.isJsonConfigurationValid}
        isChanged={this.state.isJsonConfigurationChanged}
        onEditCancel={() => Actions.resetJsonConfiguration(state.componentId, state.configurationId)}
        onEditChange={parameters =>
          Actions.updateJsonConfiguration(state.componentId, state.configurationId, parameters)
        }
        onEditSubmit={() =>
          Actions.saveJsonConfiguration(
            state.componentId,
            state.configurationId,
            'Configuration edited manually'
          )
        }
        showSaveModal={this.state.isParsableConfiguration && !this.state.isJsonConfigurationParsable}
        saveModalTitle="Save Parameters"
        saveModalBody={
          <div>
            The changes in the configuration are not compatible with the original visual form. Saving this configuration
            will disable the visual representation of the whole configuration and you will be able to edit the
            configuration in JSON editor only.
          </div>
        }
      />
    ];
  },

  renderOpenJsonLink() {
    const state = this.state;
    return (
      <span>
        <small>
          <a onClick={() => Actions.openJsonEditor(state.componentId, state.configurationId)}>
            Open JSON editor
          </a>{' '}
          (discards all unsaved changes)

        </small>
      </span>
    );
  },

  renderCloseJsonLink() {
    const state = this.state;
    if (!this.state.isParsableConfiguration) {
      return (
        <small>
          Can't close JSON editor, configuration is not compatible. Revert your changes to allow switching back to the
          visual form.
        </small>
      );
    }
    return (
      <small>
        <a onClick={() => Actions.closeJsonEditor(state.componentId, state.configurationId, state)}>
          Close JSON editor
        </a>{' '}
        (discards all unsaved changes)
      </small>
    );
  },

  render() {
    return (
      <div>
        {this.state.isJsonEditorOpen || !this.state.isParsableConfiguration
          ? <div className="kbc-inner-padding">{this.renderJsonEditor()}</div>
          : this.renderForm()}
      </div>

    );
  }


});
