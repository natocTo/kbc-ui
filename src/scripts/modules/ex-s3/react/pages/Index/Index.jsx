import React from 'react';

// stores
import ComponentStore from '../../../../components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../../components/stores/InstalledComponentsStore';
import StorageTablesStore from '../../../../components/stores/StorageTablesStore';
import StorageBucketsStore from '../../../../components/stores/StorageBucketsStore';
import RoutesStore from '../../../../../stores/RoutesStore';
import LatestJobsStore from '../../../../jobs/stores/LatestJobsStore';
import createStoreMixin from '../../../../../react/mixins/createStoreMixin';
import storeProvisioning from '../../../storeProvisioning';

// actions
import actionsProvisioning from '../../../actionsProvisioning';

// specific components
import Settings from '../../components/Settings';
import Credentials from '../../components/Credentials';
import Advanced from '../../components/Advanced';

// global components
import ComponentDescription from '../../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../../components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../../components/react/components/DeleteConfigurationButton';
import RunComponentButton from '../../../../components/react/components/RunComponentButton';
import LatestVersions from '../../../../components/react/components/SidebarVersionsWrapper';
import LatestJobs from '../../../../components/react/components/SidebarJobs';
import SaveButtons from '../../../../../react/common/SaveButtons';
import {TabbedArea, TabPane} from './../../../../../react/common/KbcBootstrap';

// utils
import {getDefaultTable, getDefaultBucket} from '../../../utils';

// css
import './Index.less';

// CONSTS
const COMPONENT_ID = 'keboola.ex-s3';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, StorageTablesStore, StorageBucketsStore, LatestJobsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const component = ComponentStore.getComponent(COMPONENT_ID);
    const store = storeProvisioning(configId);
    const actions = actionsProvisioning(configId);
    return {
      component: component,
      configId: configId,
      actions: actions,
      tables: StorageTablesStore.getAll(),
      localState: store.getLocalState(),
      settings: store.settings,
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId)
    };
  },


  renderButtons() {
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.localState.get('isSaving', false)}
          isChanged={this.state.localState.get('isChanged', false)}
          onSave={this.state.actions.editSave}
          onReset={this.state.actions.editReset}
            />
      </div>
    );
  },

  renderSettings() {
    return (
      <TabbedArea
        defaultActiveEventKey={1}
        animation={false}
        id="modules-ex-s3-react-pages-index-index-tabbed-area"
      >
        <TabPane title="General" eventKey={1}>
          <Settings
            s3Bucket={this.state.settings.get('s3Bucket')}
            s3Key={this.state.settings.get('s3Key')}
            wildcard={this.state.settings.get('wildcard')}
            destination={this.state.settings.get('destination')}
            destinationDefaultBucket={getDefaultBucket(this.state.configId)}
            destinationDefaultTable={getDefaultTable(this.state.configId)}
            incremental={this.state.settings.get('incremental')}
            primaryKey={this.state.settings.get('primaryKey')}
            onChange={this.state.actions.editChange}
            tables={this.state.tables}
            defaultTable={getDefaultTable(this.state.configId)}
            disabled={this.state.localState.get('isSaving', false)}
            destinationEditing={this.state.localState.get('isDestinationEditing', false)}
            onDestinationEdit={this.state.actions.destinationEdit}
          />
        </TabPane>
        <TabPane title="AWS Credentials" eventKey={2}>
          <Credentials
            awsAccessKeyId={this.state.settings.get('awsAccessKeyId')}
            awsSecretAccessKey={this.state.settings.get('awsSecretAccessKey')}
            onChange={this.state.actions.editChange}
            disabled={this.state.localState.get('isSaving', false)}
          />
        </TabPane>
        <TabPane title="Advanced" eventKey={3}>
          <Advanced
            delimiter={this.state.settings.get('delimiter')}
            enclosure={this.state.settings.get('enclosure')}
            onChange={this.state.actions.editChange}
            disabled={this.state.localState.get('isSaving', false)}
          />
        </TabPane>
      </TabbedArea>
    );
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-header kbc-header-without-row-fix">
            <ComponentDescription
              componentId={COMPONENT_ID}
              configId={this.state.configId}
            />
          </div>
          <div className="kbc-header kbc-header-without-row-fix">
            {this.renderButtons()}
            {this.renderSettings()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={COMPONENT_ID}
            configId={this.state.configId}
          />
          <ul className="nav nav-stacked">
            <li>
              <RunComponentButton
                  title="Run"
                  component={COMPONENT_ID}
                  mode="link"
                  runParams={() => ({config: this.state.configId})}
              >
                <span>You are about to run extraction.</span>
              </RunComponentButton>
            </li>
            <li>
              <DeleteConfigurationButton
                componentId={COMPONENT_ID}
                configId={this.state.configId}
              />
            </li>
          </ul>
          <LatestJobs
            jobs={this.state.latestJobs}
            limit={3}
          />
          <LatestVersions
            componentId={COMPONENT_ID}
          />
        </div>
      </div>
    );
  }
});
