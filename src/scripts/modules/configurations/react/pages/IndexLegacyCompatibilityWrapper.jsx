import React from 'react';

// stores
import ComponentsStore from '../../../components/stores/ComponentsStore';
import ConfigurationsStore from '../../ConfigurationsStore';
import RoutesStore from '../../../../stores/RoutesStore';

import Index from './Index';
import GenericDockerDetail from '../../../components/react/pages/GenericDockerDetail';

export default React.createClass({
  getInitialState() {
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

  render() {
    if (!this.state.settings.getIn(['legacyUI', 'isMigrated'])(this.state.configuration)) {
      return (
        <GenericDockerDetail/>
      );
    }
    return (
      <Index />
    );
  }
});
