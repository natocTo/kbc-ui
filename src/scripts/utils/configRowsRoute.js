import React from 'react';
import Index from '../react/common/ConfigRows/Index';
import Row from '../react/common/ConfigRows/Row';
import Versions from '../react/common/ConfigRows/Versions';
import installedComponentsActions from '../modules/components/InstalledComponentsActionCreators';
import versionsActions from '../modules/components/VersionsActionCreators';
import rowVersionsActions from '../modules/components/RowVersionsActionCreators';
import jobsActions from '../modules/jobs/ActionCreators';
import InstalledComponentsStore from '../modules/components/stores/InstalledComponentsStore';
import ConfigurationRowsStore from '../modules/components/stores/ConfigurationRowsStore';
import _ from 'lodash';
import fuzzy from 'fuzzy';
var Immutable = require('immutable');

const columnTypeConstants = {
  STORAGE_LINK_DEFAULT_BUCKET: 'storage-link-default-bucket',
  VALUE: 'value'
};

// defaults
const defaults = {
  credentials: {
    detail: {
      isComplete: function() {
        return true;
      }
    }
  },
  row: {
    hasState: false,
    name: {
      singular: 'Table',
      plural: 'Tables'
    },
    detail: {
      onCreate: function() {
        return Immutable.fromJS({});
      }
    },
    columns: [
      {
        name: 'Name',
        type: columnTypeConstants.VALUE,
        value: function(row) {
          return row.get('name') !== '' ? row.get('name') : 'Untitled';
        }
      },
      {
        name: 'Storage',
        type: columnTypeConstants.STORAGE_LINK_DEFAULT_BUCKET,
        value: function(row) {
          return row.getIn(['configuration', 'parameters', 'name'], 'untitled');
        }
      },
      {
        name: 'Description',
        type: 'value',
        value: function(row) {
          return (
            <small>
              {row.get('description') !== '' ? row.get('description') : 'No description'}
            </small>
          );
        }
      }
    ],
    searchFilter: function(row, query) {
      return fuzzy.test(query, row.get('name')) || fuzzy.test(query, row.get('description'));
    }
  }
};

module.exports = {
  columnTypes: columnTypeConstants,
  createRoute(settings) {
    const settingsWithDefaults = _.defaultsDeep(settings, defaults);
    let route = {
      name: settingsWithDefaults.componentId,
      settings: settingsWithDefaults,
      path: ':config',
      title: (routerState) => {
        const configId = routerState.getIn(['params', 'config']);
        return InstalledComponentsStore.getConfig(settingsWithDefaults.componentId, configId).get('name');
      },
      isComponent: true,
      defaultRouteHandler: Index,
      poll: {
        interval: 10,
        action: (params) => jobsActions.loadComponentConfigurationLatestJobs(settingsWithDefaults.componentId, params.config)
      },
      requireData: [
        (params) => installedComponentsActions.loadComponentConfigData(settingsWithDefaults.componentId, params.config),
        (params) => versionsActions.loadVersions(settingsWithDefaults.componentId, params.config)
      ],
      childRoutes: []
    };
    route.childRoutes.push(
      {
        name: settingsWithDefaults.componentId + '-row',
        settings: settingsWithDefaults,
        path: 'rows/:row',
        title: (routerState) => {
          const configId = routerState.getIn(['params', 'config']);
          const rowId = routerState.getIn(['params', 'row']);
          const configurationRow = ConfigurationRowsStore.get(settingsWithDefaults.componentId, configId, rowId);
          return configurationRow.get('name') !== '' ? configurationRow.get('name') : 'Untitled ' + settingsWithDefaults.row.name.singular;
        },
        requireData: [
          (params) => rowVersionsActions.loadVersions(settingsWithDefaults.componentId, params.config, params.row)
        ],

        defaultRouteHandler: Row,
        childRoutes: [
          {
            name: settingsWithDefaults.componentId + '-row-versions',
            settings: settingsWithDefaults,
            path: 'versions',
            title: 'Versions',
            defaultRouteHandler: Versions
          }
        ]
      }
    );
    return route;
  }
};
