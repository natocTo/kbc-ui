import React from 'react';

// stores
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import ConfigRowsStore from '../../../components/stores/ConfigRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import LatestJobsStore from '../../../jobs/stores/LatestJobsStore';
import VersionsStore from '../../../components/stores/VersionsStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import configRowsActions from '../../../components/ConfigRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ComponentDescription from '../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import LatestVersions from '../../../components/react/components/SidebarVersionsWrapper';
import LatestJobs from '../../../components/react/components/SidebarJobs';
import {Link} from 'react-router';
import CreateConfigRowButton from '../../../components/react/components/CreateConfigRowButton';
import ConfigRowsTable from '../../../components/react/components/ConfigRowsTable';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ConfigRowsStore, LatestJobsStore, VersionsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    return {
      configId: configId,
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
      rows: ConfigRowsStore.getRows(COMPONENT_ID, configId)
    };
  },

  renderRowsTable() {
    const state = this.state;
    if (this.state.rows.count() === 0) {
      return [
        (<div className="kbc-inner-content-padding-fix with-bottom-border">
          <h3>TODO (Empty state)</h3>
          <ul>
            <li>Create credentials button</li>
            <li>Add rows button</li>
            <li>Link to documentation</li>
          </ul>
        </div>)
      ];
    } else {
      return [
        (<div className="kbc-inner-content-padding-fix with-bottom-border">
          <h3>TODO</h3>
          <ul>
            <li>Row sorting</li>
            <li>Add row link icon</li>
            <li>Documentation?</li>
            <li>Delete row button underine</li>
          </ul>
        </div>),
        (<ConfigRowsTable
            rows={this.state.rows.toList()}
            componentId={COMPONENT_ID}
            configId={this.state.configId}
            rowDelete={function(rowId) {
              return configRowsActions.delete(COMPONENT_ID, state.configId, rowId);
            }}
            rowDeletePending={function(rowId) {
              return ConfigRowsStore.getPendingActions(COMPONENT_ID, state.configId, rowId).has('delete');
            }}
            rowEnableDisable={function(rowId) {
              if (state.rows.get(rowId).get('isDisabled', false)) {
                return configRowsActions.enable(COMPONENT_ID, state.configId, rowId);
              } else {
                return configRowsActions.disable(COMPONENT_ID, state.configId, rowId);
              }
            }}
            rowEnableDisablePending={function(rowId) {
              return ConfigRowsStore.getPendingActions(COMPONENT_ID, state.configId, rowId).has('disable') || ConfigRowsStore.getPendingActions(COMPONENT_ID, state.configId, rowId).has('enable');
            }}
            rowLinkTo={COMPONENT_ID + '-row'}
          />),
        (<div className="text-center">
          <CreateConfigRowButton
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
              <CreateConfigRowButton
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