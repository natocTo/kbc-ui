// common wr-db-{generic} modules
import VersionsActionCreators from '../components/VersionsActionCreators';
import InstalledComponentsStore from '../components/stores/InstalledComponentsStore';
import storageActionCreators from '../components/StorageActionCreators';
import JobsActionCreators from '../jobs/ActionCreators';
import {createTablesRoute} from '../table-browser/routes';
import ApplicationStore from '../../stores/ApplicationStore';

// OLD WR DB MODULES and stuff
import dbwrIndex from '../wr-db/react/pages/index/Index';
import dbWrTableDetail from '../wr-db/react/pages/table/Table';
import dbWrCredentialsDetail from '../wr-db/react/pages/credentials/Credentials';
import dbWrActionCreators from '../wr-db/actionCreators';
import dbWrCredentialsHeader from '../wr-db/react/components/CredentialsHeaderButtons';
import dbWrDockerProxyApi from '../wr-db/templates/dockerProxyApi';

// NEW WR DB MODULES and stuff
import React from 'react';
import genericIndex from './react/Index/Index';
import genericTable from './react/Table/Table';
import genericCredentials from './react/Creadentials/Credentials';
import InstalledComponentsActions from '../components/InstalledComponentsActionCreators';
import provisioningUtils from './provisioningUtils';

import * as credentialsTemplate from './templates/credentials';
import hasSshTunnel from './templates/hasSshTunnel';

import {Map} from 'immutable';

const GENERIC_WR_DB_FEATURE = 'ui-wr-db-generic';
const hasWrDbGenericFeature = () => ApplicationStore.hasCurrentAdminFeature(GENERIC_WR_DB_FEATURE);

const createProxyRouteHandler = (oldWrDbHandler, newWrDbHandler) => {
  return (props) => {
    let handler = oldWrDbHandler;
    if (hasWrDbGenericFeature()) {
      handler = newWrDbHandler;
    }
    if (handler) {
      return React.createElement(handler, props);
    } else {
      return <span/>;
    }
  };
};

export default function(componentId, driver, isProvisioning) {
  const dbWrdockerProxyActions = dbWrDockerProxyApi(componentId);
  const dbWrProvisioning = provisioningUtils(componentId, driver);

  return {
    name: componentId,
    path: ':config',
    title: (routerState) => {
      var configId;
      configId = routerState.getIn(['params', 'config']);
      return InstalledComponentsStore.getConfig(componentId, configId).get('name');
    },
    isComponent: true,
    poll: {
      interval: 5,
      action: params => JobsActionCreators.loadComponentConfigurationLatestJobs(componentId, params.config)
    },
    defaultRouteHandler: createProxyRouteHandler(dbwrIndex(componentId), genericIndex(componentId, driver, isProvisioning)),
    requireData: [
      (params) => {
        if (hasWrDbGenericFeature()) {
          return InstalledComponentsActions.loadComponentConfigData(componentId, params.config);
        }
        // old wr db stuff
        const prepareWriterDataFn = () => dbWrActionCreators.loadConfiguration(componentId, params.config);
        const dockerPromise = !!dbWrdockerProxyActions && dbWrdockerProxyActions.loadConfigData(params.config);
        if (dockerPromise) {
          return dockerPromise.then(prepareWriterDataFn);
        } else {
          return prepareWriterDataFn();
        }
      },
      () => storageActionCreators.loadTables(),
      params => VersionsActionCreators.loadVersions(componentId, params.config)
    ],
    childRoutes: [
      createTablesRoute(componentId),
      {
        name: componentId + '-table',
        path: 'table/:tableId',
        handler: createProxyRouteHandler(dbWrTableDetail(componentId), genericTable(componentId)),
        title: function(routerState) {
          var tableId;
          tableId = routerState.getIn(['params', 'tableId']);
          return tableId;
        },
        requireData: [
          function(params) {
            if (!hasWrDbGenericFeature()) {
              return dbWrActionCreators.loadTableConfig(componentId, params.config, params.tableId);
            }
          }
        ]
      },
      {
        name: componentId + '-credentials',
        path: 'credentials',
        handler: createProxyRouteHandler(dbWrCredentialsDetail(componentId, driver, isProvisioning), genericCredentials(componentId, driver, credentialsTemplate, isProvisioning, hasSshTunnel(componentId))),
        headerButtonsHandler: createProxyRouteHandler(dbWrCredentialsHeader(componentId, driver, isProvisioning), null),
        title: (routerState) => {
          var configId = routerState.getIn(['params', 'config']);
          var credentials = InstalledComponentsStore.getConfigData(componentId, configId).getIn(['parameters', 'db'], Map());
          if (!dbWrProvisioning.isProvisioningCredentials(credentials)) {
            return 'Credentials';
          } else {
            return 'Keboola provided database credentials';
          }
        }
      }
    ]
  };
}
