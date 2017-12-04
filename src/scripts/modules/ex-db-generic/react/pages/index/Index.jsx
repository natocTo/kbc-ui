import React from 'react';
import {Map} from 'immutable';
import classnames from 'classnames';

import createStoreMixin from '../../../../../react/mixins/createStoreMixin';

import * as storeProvisioning from '../../../storeProvisioning';
import RoutesStore from '../../../../../stores/RoutesStore';
import LatestJobsStore from '../../../../jobs/stores/LatestJobsStore';
import VersionsStore from '../../../../components/stores/VersionsStore';

import QueryTable from './QueryTable';
import CreateQueryElement from '../../components/CreateQueryElement';
import ComponentDescription from '../../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../../components/react/components/ComponentMetadata';
import SidebarVersions from '../../../../components/react/components/SidebarVersionsWrapper';

import DeleteConfigurationButton from '../../../../components/react/components/DeleteConfigurationButton';

import LatestJobs from '../../../../components/react/components/SidebarJobs';
import JobStatusCircle from '../../../../../react/common/JobStatusCircle';
import RunComponentButton from '../../../../components/react/components/RunComponentButton';

import {Link} from 'react-router';
import SearchRow from '../../../../../react/common/SearchRow';
import * as actionsProvisioning from '../../../actionsProvisioning';
import LastUpdateInfo from '../../../../../react/common/LastUpdateInfo';

import {Navigation} from 'react-router';

import Quickstart from '../../components/Quickstart';
import SourceTablesError from '../../components/SourceTablesError';

export default function(componentId) {
  const actionsCreators = actionsProvisioning.createActions(componentId);
  return React.createClass({
    displayName: 'ExDbIndex',
    mixins: [createStoreMixin(VersionsStore, LatestJobsStore, storeProvisioning.componentsStore), Navigation],

    componentWillReceiveProps() {
      return this.setState(this.getStateFromStores());
    },

    componentDidMount() {
      // fetch sourceTable info if not done already
      if (!this.state.sourceTables) {
        return actionsProvisioning.loadSourceTables(componentId, this.state.configId);
      }
    },

    getStateFromStores() {
      const config = RoutesStore.getRouterState().getIn(['params', 'config']);
      const ExDbStore = storeProvisioning.createStore(componentId, config);
      const queries = ExDbStore.getQueries();
      const credentials = ExDbStore.getCredentials();
      const enabledQueries = queries.filter(function(query) {
        return query.get('enabled');
      });
      const hasValidCredentials = ExDbStore.hasValidCredentials(credentials);
      return {
        configId: config,
        versions: VersionsStore.getVersions(componentId, config),
        pendingActions: ExDbStore.getQueriesPendingActions(),
        latestJobs: LatestJobsStore.getJobs(componentId, config),
        hasCredentials: hasValidCredentials,
        newCredentials: ExDbStore.getNewCredentials(),
        sourceTables: ExDbStore.getSourceTables(),
        queries: queries,
        queriesFilter: ExDbStore.getQueriesFilter(),
        queriesFiltered: ExDbStore.getQueriesFiltered(),
        hasEnabledQueries: enabledQueries.count() > 0,
        validConnection: ExDbStore.isConnectionValid(),
        localState: ExDbStore.getLocalState()
      };
    },

    handleCredentialsSetup() {
      actionsCreators.updateEditingCredentials(this.state.configId, this.state.newCredentials);
      this.transitionTo(
        'ex-db-generic-' + componentId + '-credentials',
        {config: this.state.configId}
      );
    },

    handleFilterChange(query) {
      return actionsCreators.setQueriesFilter(this.state.configId, query);
    },

    handleRefreshSourceTables() {
      return actionsProvisioning.reloadSourceTables(componentId, this.state.configId);
    },

    renderNewQueryLink() {
      return (
        <CreateQueryElement
          isNav={false}
          configurationId={this.state.configId}
          componentId={componentId}
          actionsProvisioning={actionsProvisioning}
        />
      );
    },

    renderCredentialsSetup() {
      if (!this.state.hasCredentials) {
        return (
          <div className="row component-empty-state text-center">
            <p>Please setup database credentials for this extractor</p>
            <button
              className="btn btn-success"
              onClick={this.handleCredentialsSetup}
            >Setup Database Credentials</button>
          </div>
        );
      }
    },

    renderQueriesMain() {
      if (this.state.queries.count() > 0) {
        if (this.state.queriesFiltered.count() > 0) {
          return (
            <QueryTable
              queries={this.state.queriesFiltered}
              configurationId={this.state.configId}
              componentId={componentId}
              pendingActions={this.state.pendingActions}/>
          );
        } else {
          return (
            <div className="table table-striped">
              <div className="tfoot">
                <div className="tr">
                  <div className="td">
                    No tables found
                  </div>
                </div>
              </div>
            </div>
          );
        }
      } else if (actionsProvisioning.componentSupportsSimpleSetup(componentId) && this.state.hasCredentials) {
        return (
          <div className="row component-empty-state text-center">
            <div className="col-md-12">
              <p>There are no tables configured yet.</p>
              <Quickstart
                componentId={componentId}
                configId={this.state.configId}
                isLoadingSourceTables={this.state.localState.getIn(storeProvisioning.loadingSourceTablesPath)}
                isTestingConnection={this.state.localState.getIn(storeProvisioning.testingConnectionPath)}
                validConnection={this.state.localState.getIn(storeProvisioning.connectionValidPath)}
                sourceTables={this.state.localState.getIn(storeProvisioning.sourceTablesPath)}
                sourceTablesError={this.state.localState.getIn(storeProvisioning.sourceTablesErrorPath)}
                quickstart={this.state.localState.get('quickstart') || Map()}
                onChange={actionsCreators.quickstartSelected}
                onSubmit={actionsCreators.quickstart}
              />
              <div className="help-block">
                Select the tables you'd like to import to autogenerate your configuration.
                You can edit them later at any time.  <br/>
                Not seeing your newest tables?
                {' '}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleRefreshSourceTables();
                  }}
                >
                  Reload
                </a>
                {' '}
                the tables list.
              </div>
            </div>
          </div>
        );
      } else if (this.state.hasCredentials) {
        return (
          <div className="row component-empty-state text-center">
            <p>There are no tables configured yet.</p>
            {this.renderNewQueryLink()}
          </div>
        );
      }
    },

    renderCredentialsLink() {
      if (this.state.hasCredentials) {
        const link = 'ex-db-generic-' + componentId + '-credentials';
        return (
          <li>
            <Link to={link} params={{ config: this.state.configId }}>
              <JobStatusCircle status={(this.state.validConnection) ? 'success' : 'error'}/> Database Credentials
            </Link>
          </li>
        );
      }
    },

    render() {
      const configurationId = this.state.configId;
      return (
        <div className="container-fluid">
          <div className="col-md-9 kbc-main-content">
            <div className="row kbc-header">
              <div>
                <ComponentDescription
                  componentId={componentId}
                  configId={this.state.configId}
                />
              </div>
            </div>
            <SourceTablesError
              componentId={componentId}
              configId={this.state.configId}
              connectionTesting={this.state.localState.getIn(storeProvisioning.testingConnectionPath, false)}
              connectionError={this.state.localState.getIn(storeProvisioning.connectionErrorPath)}
              sourceTablesLoading={this.state.localState.getIn(storeProvisioning.loadingSourceTablesPath, false)}
              sourceTablesError={this.state.localState.getIn(storeProvisioning.sourceTablesErrorPath)}
            />
            {this.state.hasCredentials && this.state.queries.count() > 0 ? (
              <div className="row">
                <div className="col-sm-9" style={{padding: '0px'}}>
                  <SearchRow
                    onChange={this.handleFilterChange}
                    query={this.state.queriesFilter}
                  />
                </div>
                <div className="col-sm-3">
                  <div className="text-right" style={{marginTop: '16px'}}>
                    {this.renderNewQueryLink()}
                  </div>
                </div>
              </div>
            ) : null}
            {this.state.hasCredentials ? this.renderQueriesMain() : this.renderCredentialsSetup()}
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
                  runParams={function() { return { config: configurationId }; }}
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

            <LatestJobs limit={3} jobs={this.state.latestJobs}/>

            <SidebarVersions limit={3} componentId={componentId}/>

          </div>
        </div>
      );
    }
  });
}
