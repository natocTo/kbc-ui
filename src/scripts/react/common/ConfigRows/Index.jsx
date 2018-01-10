import React from 'react';

// stores
import InstalledComponentsStore from '../../../modules/components/stores/InstalledComponentsStore';
import ConfigurationRowsStore from '../../../modules/components/stores/ConfigurationRowsStore';
import ConfigurationsStore from '../../../modules/components/stores/ConfigurationsStore';
import RoutesStore from '../../../stores/RoutesStore';
import LatestJobsStore from '../../../modules/jobs/stores/LatestJobsStore';
import VersionsStore from '../../../modules/components/stores/VersionsStore';
import createStoreMixin from '../../mixins/createStoreMixin';

// actions
import configurationRowsActions from '../../../modules/components/ConfigurationRowsActionCreators';
import configurationsActions from '../../../modules/components/ConfigurationsActionCreators';

// global components
import RunComponentButton from '../../../modules/components/react/components/RunComponentButton';
import ComponentDescription from '../../../modules/components/react/components/ComponentDescription';
import ComponentMetadata from '../../../modules/components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../modules/components/react/components/DeleteConfigurationButton';
import LatestVersions from '../../../modules/components/react/components/SidebarVersionsWrapper';
import LatestJobs from '../../../modules/components/react/components/SidebarJobs';
import CreateConfigurationRowButton from '../../../modules/components/react/components/CreateConfigurationRowButton';
import ConfigurationRowsTable from '../../../modules/components/react/components/ConfigurationRowsTable';
import Credentials from './Credentials';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ConfigurationsStore, ConfigurationRowsStore, LatestJobsStore, VersionsStore)],

  getStateFromStores() {
    const configurationId = RoutesStore.getCurrentRouteParam('config');
    const settings = RoutesStore.getRouteSettings();
    return {
      componentId: settings.get('componentId'),
      settings: settings,
      configurationId: configurationId,
      latestJobs: LatestJobsStore.getJobs(settings.get('componentId'), configurationId),
      rows: ConfigurationRowsStore.getRows(settings.get('componentId'), configurationId)
    };
  },

  renderRowsTable() {
    const state = this.state;
    if (this.state.rows.count() === 0) {
      return (
        <div className="kbc-inner-content-padding-fix with-bottom-border">
          <h3>TODO (Empty state)</h3>
        </div>);
    } else {
      let header, columns, filter;
      if (this.state.settings.hasIn(['list', 'header'])) {
        header = this.state.settings.getIn(['list', 'header']).toJS();
      }
      if (this.state.settings.hasIn(['list', 'columns'])) {
        columns = this.state.settings.getIn(['list', 'columns']).toJS();
      }
      if (this.state.settings.hasIn(['list', 'filter'])) {
        filter = this.state.settings.getIn(['list', 'filter']);
      }
      return (<ConfigurationRowsTable
        key="rows"
        rows={this.state.rows.toList()}
        componentId={this.state.componentId}
        configurationId={this.state.configurationId}
        rowDelete={function(rowId) {
          return configurationRowsActions.delete(state.componentId, state.configurationId, rowId);
        }}
        rowDeletePending={function(rowId) {
          return ConfigurationRowsStore.getPendingActions(state.componentId, state.configurationId, rowId).has('delete');
        }}
        rowEnableDisable={function(rowId) {
          if (state.rows.get(rowId).get('isDisabled', false)) {
            return configurationRowsActions.enable(state.componentId, state.configurationId, rowId);
          } else {
            return configurationRowsActions.disable(state.componentId, state.configurationId, rowId);
          }
        }}
        rowEnableDisablePending={function(rowId) {
          return ConfigurationRowsStore.getPendingActions(state.componentId, state.configurationId, rowId).has('disable') || ConfigurationRowsStore.getPendingActions(state.componentId, state.configurationId, rowId).has('enable');
        }}
        rowLinkTo={this.state.componentId + '-row'}
        onOrder={function(rowIds) {
          return configurationsActions.orderRows(state.componentId, state.configurationId, rowIds);
        }}
        orderPending={ConfigurationsStore.getPendingActions(state.componentId, state.configurationId).has('order-rows')}
        header={header}
        columns={columns}
        filter={filter}
      />);
    }
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
          <Credentials/>
          {this.renderRowsTable()}
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={this.state.componentId}
            configId={this.state.configurationId}
          />
          <ul className="nav nav-stacked">
            <li>
              <RunComponentButton
                  title="Run"
                  component={this.state.componentId}
                  mode="link"
                  runParams={() => ({config: this.state.configurationId})}
              >
                <span>You are about to run the configuration.</span>
              </RunComponentButton>
            </li>
            <li>
              <CreateConfigurationRowButton
                label={'Add ' + this.state.settings.getIn(['rowItem', 'singular'])}
                componentId={this.state.componentId}
                configId={this.state.configurationId}
                onRowCreated={function() { return; }}
                emptyConfig={function() { return {};}}
                type="link"
              />
            </li>
            <li>
              <DeleteConfigurationButton
                componentId={this.state.componentId}
                configId={this.state.configurationId}
              />
            </li>
          </ul>
          <LatestJobs
            jobs={this.state.latestJobs}
            limit={3}
          />
          <LatestVersions
            componentId={this.state.componentId}
          />
        </div>
      </div>
    );
  }
});