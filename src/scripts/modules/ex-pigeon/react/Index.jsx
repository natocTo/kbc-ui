import React from 'react';

import storeProvisioning, {storeMixins} from '../storeProvisioning';
import ComponentStore from '../../components/stores/ComponentsStore';
import RoutesStore from '../../../stores/RoutesStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import LatestJobsStore from '../../jobs/stores/LatestJobsStore';

// actions
import actionsProvisioning from '../actionsProvisioning';

// ui components
import ComponentMetadata from '../../components/react/components/ComponentMetadata';
import ComponentDescription from '../../components/react/components/ComponentDescription';
import LatestVersions from '../../components/react/components/SidebarVersionsWrapper';
import {RefreshIcon} from '@keboola/indigo-ui';

// import ConfigurationForm from './ConfigurationForm';


const COMPONENT_ID = 'keboola.ex-pigeon';

export default React.createClass({
  mixins: [createStoreMixin(...storeMixins, LatestJobsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const store = storeProvisioning(configId);
    const actions = actionsProvisioning(configId);
    const component = ComponentStore.getComponent(COMPONENT_ID);

    return {
      configId: configId,
      store: store,
      actions: actions,
      component: component,
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
      localState: store.getLocalState()
    };
  },

  componentDidMount() {
    this.state.actions.requestEmail();
  },
  render() {
    return (
        <div className="container-fluid">
            <div className="col-md-9 kbc-main-content">
                <div className="kbc-inner-content-padding-fix with-bottom-border">
                    <ComponentDescription
                        componentId={COMPONENT_ID}
                        configId={this.state.configId}
                    />
                </div>
                {this.resolveEmail()}
            </div>
            <div className="col-md-3 kbc-main-sidebar">
                <ComponentMetadata
                    configId={this.state.configId}
                    componentId={COMPONENT_ID}
                />
                <LatestVersions
                    limit={3}
                    componentId={COMPONENT_ID}
                />
            </div>
        </div>
    );
  },
  resolveEmail() {
    const isLoading = this.state.localState.get('isLoading', true);
    if (isLoading) {
      return <RefreshIcon isLoading={isLoading}/>;
    } else {
      return this.state.localState.get('requestedEmail');
    }
  }
});
