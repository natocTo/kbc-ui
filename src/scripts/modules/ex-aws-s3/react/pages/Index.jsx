import React from 'react';

// stores
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import ConfigurationRowsStore from '../../../components/stores/ConfigurationRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import LatestJobsStore from '../../../jobs/stores/LatestJobsStore';
import VersionsStore from '../../../components/stores/VersionsStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import configurationRowsActions from '../../../components/ConfigurationRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ComponentDescription from '../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import LatestVersions from '../../../components/react/components/SidebarVersionsWrapper';
import LatestJobs from '../../../components/react/components/SidebarJobs';
import {Link} from 'react-router';
import CreateConfigurationRowButton from '../../../components/react/components/CreateConfigurationRowButton';
import ConfigurationRowsTable from '../../../components/react/components/ConfigurationRowsTable';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ConfigurationRowsStore, LatestJobsStore, VersionsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    return {
      configId: configId,
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
      rows: ConfigurationRowsStore.getRows(COMPONENT_ID, configId)
    };
  },

  renderRowsTable() {
    const state = this.state;
    if (this.state.rows.count() === 0) {
      return [
        (<div className="kbc-inner-content-padding-fix with-bottom-border">
          <h3>TODO (Empty state)</h3>
          <ul>
            <li><strong>Copy from DB Extractor</strong></li>
            <li>Create credentials button</li>
            <li>Add rows button</li>
            <li>Link to documentation</li>
          </ul>
        </div>)
      ];
    } else {
      return [
        (<div className="kbc-inner-content-padding-fix with-bottom-border" key="list">
          <h3>TODO</h3>
          <ul>
            <li>Row sorting</li>
            <li>Add row link icon</li>
            <li>Documentation?</li>
            <li>Delete row button underine</li>
            <li>New Table a table mít parametrizovatelný</li>
            <li>Empty search result styling</li>
          </ul>
        </div>),
        (<ConfigurationRowsTable
            key="rows"
            rows={this.state.rows.toList()}
            componentId={COMPONENT_ID}
            configId={this.state.configId}
            rowDelete={function(rowId) {
              return configurationRowsActions.delete(COMPONENT_ID, state.configId, rowId);
            }}
            rowDeletePending={function(rowId) {
              return ConfigurationRowsStore.getPendingActions(COMPONENT_ID, state.configId, rowId).has('delete');
            }}
            rowEnableDisable={function(rowId) {
              if (state.rows.get(rowId).get('isDisabled', false)) {
                return configurationRowsActions.enable(COMPONENT_ID, state.configId, rowId);
              } else {
                return configurationRowsActions.disable(COMPONENT_ID, state.configId, rowId);
              }
            }}
            rowEnableDisablePending={function(rowId) {
              return ConfigurationRowsStore.getPendingActions(COMPONENT_ID, state.configId, rowId).has('disable') || ConfigurationRowsStore.getPendingActions(COMPONENT_ID, state.configId, rowId).has('enable');
            }}
            rowLinkTo={COMPONENT_ID + '-row'}
          />),
        (<div className="text-center" key="create">
          <CreateConfigurationRowButton
            componentId={COMPONENT_ID}
            configId={this.state.configId}
            onRowCreated={function() { return; }}
            emptyConfig={function() { return {};}}
            type="button"
          />
        </div>)
      ];
    }
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
          {this.renderRowsTable()}
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
                <span>You are about to run an extraction.</span>
              </RunComponentButton>
            </li>
            <li>
              <CreateConfigurationRowButton
                componentId={COMPONENT_ID}
                configId={this.state.configId}
                onRowCreated={function() { return; }}
                emptyConfig={function() { return {};}}
                type="link"
              />
            </li>
            <li>
              <Link to={COMPONENT_ID + '-credentials'} params={{config: this.state.configId}}>
                <span className="fa fa-user fa-fw" />
                &nbsp;Credentials
              </Link>
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
