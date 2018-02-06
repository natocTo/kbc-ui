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
import { PanelGroup, Panel } from 'react-bootstrap';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, Store)],

  getStateFromStores() {
    const settings = RoutesStore.getRouteSettings();
    const componentId = settings.get('componentId');
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const component = ComponentStore.getComponent(componentId);
    const parseFn = settings.getIn(['credentials', 'detail', 'onLoad']);
    const isCompletedFn = settings.getIn(['credentials', 'detail', 'isCompleted']);
    const isChanged = Store.isEditingConfiguration(componentId, configurationId);
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      component: component,
      configurationId: configurationId,
      configuration: Store.getEditingConfiguration(componentId, configurationId, parseFn),
      isSaving: Store.getPendingActions(componentId, configurationId).has('save-configuration'),
      isChanged: isChanged,
      credentialsOpen: !isCompletedFn(Store.getConfiguration(componentId, configurationId)) || isChanged
    };
  },

  renderButtons() {
    const state = this.state;
    return (
      <div className="text-right" style={{marginBottom: '20px'}}>
        <SaveButtons
          isSaving={this.state.isSaving}
          isChanged={this.state.isChanged}
          onSave={function() {
            return Actions.saveConfiguration(
              state.componentId,
              state.configurationId,
              state.settings.getIn(['credentials', 'detail', 'onSave']),
              state.settings.getIn(['credentials', 'detail', 'onLoad']),
              state.settings.getIn(['credentials', 'detail', 'title']) + ' edited'
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
    const Credentials = this.state.settings.getIn(['credentials', 'detail', 'render']);
    return (<Credentials
      onChange={function(diff) {
        Actions.updateConfiguration(state.componentId, state.configurationId, Immutable.fromJS(configuration.mergeDeep(Immutable.fromJS(diff))));
      }}
      disabled={this.state.isSaving}
      value={configuration.toJS()}
    />);
  },

  accordionArrow(isActive) {
    if (isActive) {
      return (<span className="fa fa-fw fa-angle-down" />);
    }
    return (<span className="fa fa-fw fa-angle-right" />);
  },

  accordionHeader(label, isActive) {
    return (
      <span>
        <span className="table">
          <span className="tbody">
            <span className="tr">
              <span className="td">
                <h4>
                  {this.accordionArrow(isActive)}
                  {label}
                </h4>
              </span>
            </span>
          </span>
        </span>
      </span>
    );
  },

  render() {
    if (!this.state.settings.has('credentials')) {
      return null;
    }
    const component = this;
    return (
      <PanelGroup
        accordion={true}
        className="kbc-accordion kbc-panel-heading-with-table"
        activeKey={this.state.credentialsOpen ? 'credentials' : ''}
        onSelect={function(activeTab) {
          if (activeTab === 'credentials') {
            component.setState({credentialsOpen: !component.state.credentialsOpen});
          }
        }}
      >
        <Panel
          header={this.accordionHeader(this.state.settings.getIn(['credentials', 'detail', 'title']), component.state.credentialsOpen)}
          eventKey="credentials"
        >
          {this.renderButtons()}
          {this.renderCredentials()}
        </Panel>
      </PanelGroup>
    );
  }
});
