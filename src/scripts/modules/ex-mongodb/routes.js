import React from 'react';

import InstalledComponentsStore from '../components/stores/InstalledComponentsStore';
import * as actionsProvisioning from './actionsProvisioning';
import ExDbIndex from './react/pages/index/Index';
import ExDbCredentialsPage from '../ex-db-generic/react/pages/credentials/CredentialsPage';
import ExDbQueryDetail from './react/pages/query-detail/QueryDetail';
import ExDbNewQuery from './react/pages/new-query/NewQuery';
import ExDbNewQueryHeaderButtons from './react/components/NewQueryHeaderButtons';
import ExDbQueryHeaderButtons from '../ex-db-generic/react/components/QueryActionButtons';
import ExDbQueryName from '../ex-db-generic/react/components/QueryName';
import JobsActionCreators from '../jobs/ActionCreators';
import StorageActionCreators from '../components/StorageActionCreators';
import * as VersionsActionsCreators from '../components/VersionsActionCreators';
import { createTablesRoute } from '../table-browser/routes';
import * as storeProvisioning from './storeProvisioning';
import * as credentialsTemplate from '../ex-db-generic/templates/credentials';

const componentId = 'keboola.ex-mongodb';

export default {
  name: componentId,
  path: ':config',
  isComponent: true,
  requireData: [
    function(params) {
      return actionsProvisioning.loadConfiguration(componentId, params.config);
    }, function(params) {
      return VersionsActionsCreators.loadVersions(componentId, params.config);
    }
  ],
  title: function(routerState) {
    const configId = routerState.getIn(['params', 'config']);
    return InstalledComponentsStore.getConfig(componentId, configId).get('name');
  },
  poll: {
    interval: 5,
    action: function(params) {
      return JobsActionCreators.loadComponentConfigurationLatestJobs(componentId, params.config);
    }
  },
  defaultRouteHandler: ExDbIndex(componentId),
  childRoutes: [
    createTablesRoute(componentId), {
      name: 'ex-db-generic-' + componentId + '-query',
      path: 'query/:query',
      title: function(routerState) {
        const configId = routerState.getIn(['params', 'config']);
        const queryId = routerState.getIn(['params', 'query']);
        const ExDbStore = storeProvisioning.createStore(componentId, configId);
        return 'Query ' + ExDbStore.getConfigQuery(parseInt(queryId, 10)).get('name');
      },
      nameEdit: function(params) {
        return React.createElement(ExDbQueryName(componentId, storeProvisioning), {
          configId: params.config,
          queryId: parseInt(params.query, 10)
        });
      },
      requireData: [
        function() {
          return StorageActionCreators.loadTables();
        }
      ],
      defaultRouteHandler: ExDbQueryDetail(componentId, actionsProvisioning, storeProvisioning),
      headerButtonsHandler: ExDbQueryHeaderButtons(componentId, actionsProvisioning, storeProvisioning, 'Export'),
      childRoutes: [createTablesRoute('ex-db-generic-' + componentId + '-query')]
    }, {
      name: 'ex-db-generic-' + componentId + '-new-query',
      path: 'new-query',
      title: function() {
        return 'New export';
      },
      requireData: [
        function() {
          return StorageActionCreators.loadTables();
        }
      ],
      handler: ExDbNewQuery(componentId),
      headerButtonsHandler: ExDbNewQueryHeaderButtons(componentId, actionsProvisioning, storeProvisioning)
    }, {
      name: 'ex-db-generic-' + componentId + '-credentials',
      path: 'credentials',
      title: function() {
        return 'Credentials';
      },
      handler: ExDbCredentialsPage(componentId, actionsProvisioning, storeProvisioning, credentialsTemplate, true)
    }
  ]
};
