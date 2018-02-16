import React, {PropTypes} from 'react';
import {fromJS} from 'immutable';
import createStoreMixin from '../mixins/createStoreMixin';
import {Loader} from '@keboola/indigo-ui';

import ComponentsStore from '../../modules/components/stores/ComponentsStore';
import ComponentIcon from './ComponentIcon';
import ComponentConfigurationLink from '../../modules/components/react/components/ComponentConfigurationLink';
import InstalledComponentsStore from '../../modules/components/stores/InstalledComponentsStore';
import InstalledComponentsActions from '../../modules/components/InstalledComponentsActionCreators';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ComponentsStore)],

  propTypes: {
    table: PropTypes.object.isRequired
  },

  getStateFromStores() {
    return {
      isConfigsLoading: InstalledComponentsStore.getIsLoading(),
      isConfigsLoaded: InstalledComponentsStore.getIsLoaded()
    };
  },

  componentDidMount() {
    if (!!this.state.isConfigsLoading && this.state.isConfigsLoaded) {
      InstalledComponentsActions.loadComponentsForce();
    }
  },

  render() {
    const {componentId, configId} = this.getLastUpdatedInfo();
    const component = componentId && ComponentsStore.getComponent(componentId);

    if (!component) {
      return 'N/A';
    }

    if (this.state.isConfigsLoading) {
      return <Loader />;
    }

    const componentName = component.get('type') !== 'transformation' ? `${component.get('name')} ${component.get('type')}` : `${component.get('type')}`;
    const config = InstalledComponentsStore.getConfig(componentId, configId);
    const configName = config ? config.get('name', configId) : configId;

    return (
      <span>
        <ComponentIcon component={fromJS(component)}/>
        <ComponentConfigurationLink componentId={componentId} configId={configId}>{componentName} / {configName}
        </ComponentConfigurationLink>
      </span>
    );
  },

  getLastUpdatedInfo() {
    const metadata = this.props.table.get('metadata');
    const componentId = metadata.find(m => m.get('key') === 'KBC.lastUpdatedBy.component.id').get('value');
    const configId = metadata.find(m => m.get('key') === 'KBC.lastUpdatedBy.configuration.id').get('value');
    return {componentId, configId};
  }

});