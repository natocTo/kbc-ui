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
import ComponentDescription from '../../../modules/components/react/components/ComponentDescription';
import ComponentMetadata from '../../../modules/components/react/components/ComponentMetadata';
import SaveButtons from '../SaveButtons';
import { Link } from 'react-router';

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
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ComponentDescription
              componentId={this.state.componentId}
              configId={this.state.configurationId}
            />
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <h3>TODO</h3>
            <ul>
              <li>Content of the right bar</li>
              <li>Hide description here?</li>
            </ul>
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            {this.renderButtons()}
            {this.renderCredentials()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={this.state.componentId}
            configId={this.state.configurationId}
          />
          <ul className="nav nav-stacked">
            <li>
              <Link to={this.state.componentId} params={{config: this.state.configurationId}}>
                <span className="fa fa-arrow-left fa-fw" />
                &nbsp;Back
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
