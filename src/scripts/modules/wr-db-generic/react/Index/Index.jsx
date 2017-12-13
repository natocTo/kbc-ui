import React from 'react';

import {List} from 'immutable';
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
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';


import LastUpdateInfo from '../../../../react/common/LastUpdateInfo';

import StorageTablesStore from '../../../components/stores/StorageTablesStore';
// @FIXME mixin from storeProvisioning
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import LatestJobsStore from '../../../jobs/stores/LatestJobsStore';
import VersionsStore from '../../../components/stores/VersionsStore';
import storeProvisioning from '../../storeProvisioning';


export default function(componentId) {
  return React.createClass({
    displayName: 'genericIndex',
    mixins: [createStoreMixin(VersionsStore, StorageTablesStore, InstalledComponentsStore, LatestJobsStore), Navigation],

    getStateFromStores() {
      const configId = RoutesStore.getRouterState().getIn(['params', 'config']);
      const WrDbStore = storeProvisioning(componentId, configId);

      return {
        configId: configId,
        versions: VersionsStore.getVersions(componentId, configId),
        latestJobs: LatestJobsStore.getJobs(componentId, configId),
        hasEnabledQueries: false,
        hasCredentials: WrDbStore.hasCredentials(),
        queries: new List()
      };
    },

    handleCredentialsSetup() {
      // actionsCreators.updateEditingCredentials(this.state.configId, this.state.newCredentials);
      this.transitionTo(
        componentId + '-credentials',
        {config: this.state.configId}
      );
    },

    render() {
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
            sourceTableErrorComponent
            {this.state.hasCredentials && this.state.queries.count() > 0 ? (
              <div className="row">
                <div className="col-sm-9" style={{padding: '0px'}}>
                  searchRowComponent
                </div>
                <div className="col-sm-3">
                  <div className="text-right" style={{marginTop: '16px'}}>
                    new querys
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
      if (!this.state.hasCredentials) {
        return (
          <div className="row component-empty-state text-center">
            <p>Please setup database credentials for this writer</p>
            <button
              className="btn btn-success"
              onClick={this.handleCredentialsSetup}
            >Setup Database Credentials</button>
          </div>
        );
      }
    },

    renderQueriesMain() {
      return (
        <div>tady budou queries</div>
      );
    }
  });
}
