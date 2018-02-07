import React from 'react';
import Immutable from 'immutable';
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
import ConfigurationRows from '../../../modules/components/react/components/ConfigurationRows';
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

  onRowCreated(rowId) {
    const transitionParams = {
      config: this.state.configurationId,
      row: rowId
    };
    RoutesStore.getRouter().transitionTo(this.state.componentId + '-row', transitionParams);
  },

  renderRowsTable() {
    const state = this.state;
    const settings = this.state.settings;
    if (this.state.rows.count() === 0) {
      return (
        <div className="kbc-inner-content-padding-fix with-bottom-border">
          <div className="component-empty-state text-center">
            <p>No {settings.getIn(['row', 'name', 'plural']).toLowerCase()} created yet.</p>
            <CreateConfigurationRowButton
              label={'New ' + state.settings.getIn(['row', 'name', 'singular'])}
              componentId={state.componentId}
              configId={state.configurationId}
              emptyConfig={settings.getIn(['row', 'detail', 'onCreate'])}
              onRowCreated={this.onRowCreated}
              createChangeDescription={function(name) {
                return settings.getIn(['row', 'name', 'singular']) + ' ' + name + ' added';
              }}
              type="button"
            />
          </div>
        </div>);
    } else {
      const header = this.state.settings.getIn(['row', 'header']).toJS();
      const columns = this.state.settings.getIn(['row', 'columns']).toJS();
      const filter = this.state.settings.getIn(['row', 'searchFilter']);
      return (<ConfigurationRows
        key="rows"
        rows={this.state.rows.toList()}
        componentId={this.state.componentId}
        configurationId={this.state.configurationId}
        rowDelete={function(rowId) {
          const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.rows.get(rowId).get('name') + ' deleted';
          return configurationRowsActions.delete(state.componentId, state.configurationId, rowId, false, changeDescription);
        }}
        rowDeletePending={function(rowId) {
          return ConfigurationRowsStore.getPendingActions(state.componentId, state.configurationId, rowId).has('delete');
        }}
        rowEnableDisable={function(rowId) {
          if (state.rows.get(rowId).get('isDisabled', false)) {
            const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.rows.get(rowId).get('name') + ' enabled';
            return configurationRowsActions.enable(state.componentId, state.configurationId, rowId, changeDescription);
          } else {
            const changeDescription = settings.getIn(['row', 'name', 'singular']) + ' ' + state.rows.get(rowId).get('name') + ' disabled';
            return configurationRowsActions.disable(state.componentId, state.configurationId, rowId, changeDescription);
          }
        }}
        rowEnableDisablePending={function(rowId) {
          return ConfigurationRowsStore.getPendingActions(state.componentId, state.configurationId, rowId).has('disable') || ConfigurationRowsStore.getPendingActions(state.componentId, state.configurationId, rowId).has('enable');
        }}
        rowLinkTo={this.state.componentId + '-row'}
        onOrder={function(rowIds, movedRowId) {
          const changeDescription = settings.getIn(['row', 'name', 'plural']) + ' order changed';
          return configurationsActions.orderRows(state.componentId, state.configurationId, rowIds, movedRowId, changeDescription);
        }}
        orderPending={ConfigurationsStore.getPendingActions(state.componentId, state.configurationId).get('order-rows', Immutable.Map())}
        header={header}
        columns={columns}
        filter={filter}
        isCompletedFn={state.settings.getIn(['row', 'detail', 'isCompleted'])}
      />);
    }
  },

  render() {
    const settings = this.state.settings;
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
                label={'New ' + this.state.settings.getIn(['row', 'name', 'singular'])}
                componentId={this.state.componentId}
                configId={this.state.configurationId}
                emptyConfig={settings.getIn(['row', 'detail', 'onCreate'])}
                onRowCreated={this.onRowCreated}
                type="link"
                createChangeDescription={function(name) {
                  return settings.getIn(['row', 'name', 'singular']) + ' ' + name + ' added';
                }}
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
