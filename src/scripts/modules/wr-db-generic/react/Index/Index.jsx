import React from 'react';

import {Button} from 'react-bootstrap';

import {Map} from 'immutable';
import {Link} from 'react-router';
import {Navigation} from 'react-router';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';

import classnames from 'classnames';

import RoutesStore from '../../../../stores/RoutesStore';

import ComponentDescription from '../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import SidebarJobs from '../../../components/react/components/SidebarJobs';
import SidebarVersions from '../../../components/react/components/SidebarVersionsWrapper';

import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ProvisioningButton from './ProvisioningButton';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import TablesByBucketsPanel from '../../../components/react/components/TablesByBucketsPanel';

import Quickstart from '../../components/Quickstart';

import LastUpdateInfo from '../../../../react/common/LastUpdateInfo';

import StorageTablesStore from '../../../components/stores/StorageTablesStore';
// @FIXME mixin from storeProvisioning
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import LatestJobsStore from '../../../jobs/stores/LatestJobsStore';
import VersionsStore from '../../../components/stores/VersionsStore';
import storeProvisioning from '../../storeProvisioning';
import actionsProvisioning from '../../actionsProvisioning';
import ComponentIcon from '../../../../react/common/ComponentIcon';
import SearchRow from '../../../../react/common/SearchRow';

import TableRow from './TableRow';

import getDriverName from '../../templates/driverNames';

const allowedBuckets = ['out', 'in'];

export default function(componentId, driver, isProvisioning) {
  const WrDbActions = actionsProvisioning(componentId, driver);

  return React.createClass({
    displayName: 'genericIndex',
    mixins: [createStoreMixin(VersionsStore, StorageTablesStore, InstalledComponentsStore, LatestJobsStore), Navigation],

    getStateFromStores() {
      const configId = RoutesStore.getRouterState().getIn(['params', 'config']);
      const WrDbStore = storeProvisioning(componentId, configId);

      return {
        configId: configId,
        component: InstalledComponentsStore.getComponent(componentId),
        versions: VersionsStore.getVersions(componentId, configId),
        latestJobs: LatestJobsStore.getJobs(componentId, configId),
        hasEnabledQueries: false,
        hasCredentials: WrDbStore.hasCredentials(),
        isSplashEnabled: WrDbStore.isSplashEnabled(),
        isSavingCredentials: WrDbStore.isSavingCredentials(),
        tables: WrDbStore.getTables(),
        sapiTables: StorageTablesStore.getAll(),
        tablesFilter: WrDbStore.getTablesFilter(),
        bucketToggles: WrDbStore.getToggles(),
        quickstartSelected: WrDbStore.getQuickstart(),
        pendingActions: WrDbStore.getPendingActions()
      };
    },

    handleGenerate() {
      WrDbActions.prepareCredentials(this.state.configId);
    },

    handleCredentialsSetup() {
      if (this.state.isSplashEnabled) {
        WrDbActions.updateEditingCredentials(this.state.configId, Map());
        WrDbActions.disableSplash();
      }

      this.transitionTo(
        componentId + '-credentials',
        {config: this.state.configId}
      );
    },

    handleFilterChange(query) {
      return WrDbActions.setTablesFilter(this.state.configId, query);
    },

    renderNewQueryLink() {
      return (
        <Button
          bsStyle="success"
        >
          <i className="kbc-icon-plus"/> New Table
        </Button>
      );
    },

    render() {
      return (
        <div className="container-fluid">
          <div className="col-md-9 kbc-main-content">
            {this.renderQuickstart()}
            <div className="row kbc-header">
              <div>
                <ComponentDescription
                  componentId={componentId}
                  configId={this.state.configId}
                />
              </div>
            </div>
            {/* sourceTableErrorComponent */}
            {this.state.hasCredentials && this.state.tables.count() > 0 ? (
              <div className="row">
                <div className="col-sm-9" style={{padding: '0px'}}>
                  <SearchRow
                    onChange={this.handleFilterChange}
                    query={this.state.tablesFilter}
                  />
                </div>
                <div className="col-sm-3">
                  <div className="text-right" style={{marginTop: '16px'}}>
                    {this.renderNewQueryLink()}
                  </div>
                </div>
              </div>
            ) : null}
            {this.state.hasCredentials && !this.state.isSplashEnabled ? this.renderQueriesMain() : this.renderCredentialsSetup()}
          </div>
          <div className="col-md-3 kbc-main-sidebar">
            <div className="kbc-buttons kbc-text-light">
              <ComponentMetadata
                componentId={componentId}
                configId={this.state.configId}
              />
              <LastUpdateInfo lastVersion={this.state.versions.get(0)}/>
            </div>
            <ul className="nav nav-stacked">
              {this.renderCredentialsLink()}
              <li className={classnames({ disabled: !this.state.hasEnabledQueries })}>
                <RunComponentButton
                  title="Run Extraction"
                  component={componentId}
                  mode="link"
                  disabled={!this.state.hasEnabledQueries}
                  disabledReason="There are no tables configured"
                  runParams={function() { return { config: this.state.configId }; }}
                >
                  You are about to run the extraction
                </RunComponentButton>
              </li>
              <li>
                <DeleteConfigurationButton
                  componentId={componentId}
                  configId={this.state.configId}
                />
              </li>
            </ul>
            <SidebarJobs limit={3} jobs={this.state.latestJobs}/>

            <SidebarVersions limit={3} componentId={componentId}/>

          </div>
        </div>
      );
    },

    renderCredentialsLink() {
      if (this.state.hasCredentials) {
        const link = componentId + '-credentials';
        return (
          <li>
            <Link to={link} params={{ config: this.state.configId }}>
              <i className="fa fa-fw fa-user"/> Database Credentials
            </Link>
          </li>
        );
      }
    },

    renderCredentialsSetup() {
      if (!isProvisioning) {
        return (
          <div className="row component-empty-state text-center">
            <p>Please setup database credentials for this writer</p>
            <button
              className="btn btn-success"
              onClick={this.handleCredentialsSetup}
            >Setup Database Credentials</button>
          </div>
        );
      } else {
        return (
          <div className="kbc-components-list">
            <div className="table kbc-table-border-vertical kbc-components-overview kbc-layout-table">
              <div className="tbody">
                <div className="tr">
                  <div className="td">
                    <ComponentIcon component={this.state.component} size="64"/>
                    <h2>Own {getDriverName(driver)} database</h2>
                    <p>User has own {getDriverName(driver)} database and will provide credentials</p>
                    <Button
                      className="btn btn-success"
                      disabled={this.state.isSavingCredentials}
                      onClick={this.handleCredentialsSetup}
                    >Setup Database Credentials</Button>
                  </div>
                  <div className="td">
                    <ComponentIcon component={this.state.component} size="64"/>
                    <h2>Keboola {getDriverName(driver)} database</h2>
                    <p>Keboola will provide and setup dedicated {getDriverName(driver)} database. Any {getDriverName(driver)} database previously provided for this configuration will be dropped.</p>
                    <ProvisioningButton
                      isSaving={this.state.isSavingCredentials}
                      disabled={this.state.isSavingCredentials}
                      onGenerate={this.handleGenerate}/>
                  </div>
                  <div className="td" />
                </div>
              </div>
            </div>
          </div>
        );
      }
    },

    renderQueriesMain() {
      const configuredIds = this.state.tables.map((table) => table.get('id')).toArray();

      return (
        <TablesByBucketsPanel
          renderHeaderRowFn={this.renderHeaderRow}
          renderTableRowFn={(table) => this.renderTableRow(table, true)}
          renderDeletedTableRowFn={(table) => this.renderTableRow(table, false)}
          filterFn={this.filterAllowedBuckets}
          searchQuery={this.state.tablesFilter}
          isTableExportedFn={this.isTableExportedFn}
          isTableShownFn={this.isTableInConfig}
          onToggleBucketFn={this.handleToggleBucket}
          isBucketToggledFn={this.isBucketToggled}
          configuredTables={configuredIds}
          showAllTables={false}
        />
      );
    },

    renderHeaderRow() {
      return (
        <div className="tr">
          <div className="th">Table name</div>
          <div className="th">Database name</div>
          <div className="th">Incremental</div>
        </div>
      );
    },

    renderTableRow(sapiTable, tableExists) {
      let configTable = this.state.tables.find((table) => table.get('tableId') === sapiTable.get('id'));
      if (!configTable) {
        configTable = Map();
      }

      const isDeleting = this.state.pendingActions.getIn([configTable.get('tableId', false), 'isDeleting'], false);
      return (
        <TableRow
          tableExists={tableExists}
          isTableExported={configTable.get('export') === true}
          isIncremental={configTable.get('incremental') === true}
          tableDbName={configTable.get('dbName')}
          table={sapiTable}
          isDeleting={isDeleting}
          onDelete={(tableId) => WrDbActions.tableDelete(this.state.configId, tableId)}
        />
      );
    },

    renderQuickstart() {
      return (
        <div className="row component-empty-state text-center">
          <div className="col-md-12">
            <Quickstart
              componentId={componentId}
              configId={this.state.configId}
              isLoadingSourceTables={false}
              sourceTables={this.state.sapiTables}
              quickstartValues={this.state.quickstartSelected}
              onChange={WrDbActions.quickstarSelect}
              onSubmit={WrDbActions.quickstartSave}
            />
          </div>
        </div>
      );
    },

    handleToggleBucket(bucketId) {
      WrDbActions.toggleBucket(this.state.configId, bucketId);
    },

    isBucketToggled(bucketId) {
      return !!this.state.bucketToggles.get(bucketId);
    },

    isTableInConfig(tableId) {
      return !!this.state.tables.find((table) => table.get('tableId') === tableId);
    },

    isTableExportedFn(tableId) {
      const configTable = this.state.tables.find((table) => table.get('tableId') === tableId);
      return configTable && configTable.get('export') === true;
    },

    filterAllowedBuckets(buckets) {
      return buckets.filter((bucket) => allowedBuckets.indexOf(bucket.get('stage')) > -1);
    }
  });
}
