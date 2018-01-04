import React from 'react';
import Immutable from 'immutable';

// stores
import ComponentStore from '../../../modules/components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../modules/components/stores/InstalledComponentsStore';
import RoutesStore from '../../../stores/RoutesStore';
import createStoreMixin from '../../mixins/createStoreMixin';
import Store from '../../../modules/components/stores/ConfigurationsStore';

// actions
import Actions from '../../../modules/components/ConfigurationsActionCreators';

// global components
import SaveButtons from '../SaveButtons';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const component = ComponentStore.getComponent(settings.get('componentId'));
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      component: component,
      configurationId: configurationId,
      configuration: Store.getEditingConfiguration(settings.get('componentId'), configurationId, settings.getIn(['adapters', 'credentials', 'parse'])),
      isSaving: Store.getPendingActions(settings.get('componentId'), configurationId).has('save-configuration'),
      isChanged: Store.isEditingConfiguration(settings.get('componentId'), configurationId)
    };
  },

  renderTitle() {
    return (
      <h2 style={{lineHeight: '32px'}}>
        {this.state.settings.get('credentialsTitle')}
      </h2>
    );
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
              state.settings.getIn(['adapters', 'credentials', 'create']),
              state.settings.getIn(['adapters', 'credentials', 'parse'])
            );
          }}
          onReset={function() {
            return Actions.resetConfiguration(state.componentId, state.configurationId);
          }}
        />
      </div>
    );
  },

  renderCredentials() {
    const state = this.state;
    const configuration = this.state.configuration;
    const Credentials = this.state.settings.getIn(['components', 'credentials']);
    return (<Credentials
      onChange={function(diff) {
        Actions.updateConfiguration(state.componentId, state.configurationId, Immutable.fromJS(configuration.mergeDeep(Immutable.fromJS(diff))));
      }}
      disabled={this.state.isSaving}
      value={configuration.toJS()}
    />);
  },

  render() {
    if (!this.state.settings.get('hasCredentials')) {
      return null;
    }
    return (
      <div className="kbc-inner-content-padding-fix with-bottom-border">
        {this.renderTitle()}
        {this.renderButtons()}
        {this.renderCredentials()}
      </div>
    );
  }
});
