import React from 'react';

// stores
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import ComponentsStore from '../../../components/stores/ComponentsStore';
import ConfigurationsStore from '../../ConfigurationsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import actions from '../../MigrationsActionCreators';

// styles
require('./LegacyUIMigration.less');

export default React.createClass({

  mixins: [createStoreMixin(InstalledComponentsStore, ConfigurationsStore)],

  getInitialState() {
    return {
      pending: false
    };
  },

  getStateFromStores() {
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const settings = RoutesStore.getRouteSettings();
    const componentId = settings.get('componentId');
    const configuration = ConfigurationsStore.get(componentId, configurationId);
    return {
      componentId: componentId,
      component: ComponentsStore.getComponent(componentId),
      settings: settings,
      configurationId: configurationId,
      configuration: configuration
    };
  },

  migrateConfig() {
    actions.migrateLegacyUI(this.state.componentId, this.state.configurationId, this.state.settings.get('legacyUI'));
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content migration">
          <div className="row text-center">
            <p>Please migrate the configuration to the newest format to unlock the latest features.</p>
            <button
              className="btn btn-success"
              onClick={this.migrateConfig}
              disabled={this.state.pending}
            >
              Migrate Configuration
            </button>
          </div>
        </div>
      </div>
    );
  }
});
