import store from '../components/stores/InstalledComponentsStore';
import {List, Map, fromJS} from 'immutable';
import fuzzy from 'fuzzy';
import * as templateFields from './templates/credentials';
import hasSshTunnel from './templates/hasSshTunnel';
import _ from 'underscore';
import string from '../../utils/string';
import getDefaultPort from './templates/defaultPorts';
import {componentSupportsConfigRows} from './actionsProvisioning';

const defaultSshPort = 22;

export const rowConfigurationType = 'row';
export const standardConfigurationType = 'standard';

export const sourceTablesPath = ['sourceTables', 'data'];
export const incrementalCandidatesPath = ['sourceTables', 'incrementalCandidates'];
export const sourceTablesErrorPath = ['sourceTables', 'error'];
export const loadingSourceTablesPath = ['sourceTables', 'loading'];
export const testingConnectionPath = ['connection', 'testing'];
export const connectionErrorPath = ['connection', 'error'];
export const connectionValidPath = ['connection', 'valid'];
export const connectionTestedPath = ['connection', 'tested'];

export function rowDataFromQuery(query) {
  return {
    'rowId': query.get('id'),
    'name': query.get('name'),
    'isDisabled': !query.get('enabled'),
    'configuration': JSON.stringify({
      'parameters': query.toJS()
    })
  };
}

export function queryFromRow(row) {
  const rowConfig = row.getIn(['configuration', 'parameters']);
  let query = Map({
    id: parseInt(row.get('id'), 10),
    name: row.get('name'),
    enabled: !row.get('isDisabled'),
    outputTable: rowConfig.get('outputTable'),
    table: rowConfig.get('table') || null,
    columns: rowConfig.get('columns'),
    primaryKey: rowConfig.get('primaryKey'),
    incremental: rowConfig.get('incremental'),
    incrementalFetchingColumn: rowConfig.get('incrementalFetchingColumn'),
    state: rowConfig.get('state')
  });
  if (rowConfig.get('query')) {
    query = query.set('query', rowConfig.get('query')).set('advancedMode', true);
  }
  return query;
}

function fetch(componentId, configId) {
  const config = store.getConfigData(componentId, configId) || Map();
  if (componentSupportsConfigRows(componentId) && !config.hasIn(['parameters', 'tables'])) {
    const rows = store.getConfigRows(componentId, configId);
    const queries = rows.map((row) => {
      return queryFromRow(row);
    }).toList();
    const setConfig = config.setIn(['parameters', 'tables'], queries);
    return {
      config: setConfig || Map(),
      parameters: setConfig.get('parameters', Map()),
      localState: store.getLocalState(componentId, configId) || Map(),
      configurationType: rowConfigurationType
    };
  }
  return {
    config: config || Map(),
    parameters: config.get('parameters', Map()),
    localState: store.getLocalState(componentId, configId) || Map(),
    configurationType: standardConfigurationType
  };
}

function generateId(existingIds) {
  const randomNumber = () => Math.floor((Math.random() * 100000) + 1);
  let newId = randomNumber();
  while (existingIds.indexOf(newId) >= 0) {
    newId = randomNumber();
  }
  return newId;
}

function isValidQuery(query) {
  const nameValid = query.get('name', '').trim().length > 0;
  const queryValid = query.get('query', '').trim().length > 0;
  const tableValid = (query.get('table')) ? query.get('table').get('tableName', '').trim().length > 0 : false;
  return nameValid && (queryValid || tableValid);
}

export const componentsStore = store;
export function createStore(componentId, configId) {
  const data = fetch(componentId, configId);
  return {
    hasValidCredentials(credentials) {
      const configCredentials = this.getCredentials();
      if (!credentials) {
        return false;
      }
      const hasSSH = hasSshTunnel(componentId);
      const fields = templateFields.getFields(componentId);
      const validGeneralCreds = _.reduce(fields, (memo, field) => {
        let value = credentials.get(field.name, '');
        if (value) {
          value = value.toString();
        }
        const alreadySaved = !_.isEmpty(configCredentials.get(field.name));
        const isValueValid = !field.required || !_.isEmpty(value) || (field.protected && alreadySaved);
        return memo && isValueValid;
      }, true);
      const ssh = credentials.get('ssh', Map());
      const sshFields = [
        {'name': 'sshHost', 'type': 'text'},
        {'name': 'user', 'type': 'text'},
        {'name': 'sshPort', 'type': 'number'}
      ];
      const isValidSSH = _.reduce(sshFields, (memo, field) => {
        let value = ssh.get(field.name, '');
        if (value) {
          value = value.toString();
        }
        return memo && !_.isEmpty(value);
      }, true);
      const hasKeys = ssh.hasIn(['keys', 'public']) && ssh.hasIn(['keys', '#private']);
      let sshValid = true;
      if (hasSSH && ssh.get('enabled')) {
        sshValid = hasKeys && isValidSSH;
      }
      return validGeneralCreds && sshValid;
    },

    // Credentials -- start --
    getCredentials() {
      return data.parameters.get('db', Map());
    },

    isEditingCredentials() {
      return !!data.localState.get('editingCredentials');
    },

    isSavingCredentials() {
      return data.localState.get('isSavingCredentials', false);
    },

    isChangedCredentials() {
      return data.localState.get('isChangedCredentials', false);
    },

    getEditingCredentials() {
      return data.localState.get('editingCredentials');
    },

    getNewCredentials() {
      var defaultNewCredentials = data.parameters.get('db', Map());
      if (!defaultNewCredentials.get('port')) {
        defaultNewCredentials = defaultNewCredentials.set('port', getDefaultPort(componentId));
      }
      if (!defaultNewCredentials.getIn(['ssh', 'sshPort'])) {
        defaultNewCredentials = defaultNewCredentials.setIn(['ssh', 'sshPort'], defaultSshPort);
      }

      const result = data.localState.get('newCredentials', defaultNewCredentials);
      if (result) {
        return result;
      } else {
        return defaultNewCredentials;
      }
    },

    isTestingConnection() {
      return data.localState.getIn(testingConnectionPath, false);
    },

    isConnectionValid() {
      return data.localState.getIn(connectionValidPath, false);
    },

    getConnectionError() {
      return data.localState.getIn(connectionErrorPath, null);
    },

    hasConnectionBeenTested() {
      return data.localState.getIn(connectionTestedPath, false);
    },
    // Credentials -- end --

    generateNewQuery(queryId = null, simpleSupport = true) {
      const ids = this.getQueries().map((q) => q.get('id')).toJS();
      let defaultQuery = {
        enabled: true,
        name: '',
        incremental: false,
        outputTable: '',
        table: '',
        columns: [],
        primaryKey: [],
        id: (queryId) ? queryId : generateId(ids)
      };
      if (!simpleSupport) {
        defaultQuery.advancedMode = true;
        defaultQuery.query = '';
      }
      const defaultNewQuery = fromJS(defaultQuery);
      data.localState.setIn(['newQueries', defaultNewQuery.get('id')], defaultNewQuery);
      return defaultNewQuery;
    },

    getNewQuery(queryId) {
      return data.localState.getIn(['newQueries', queryId]);
    },

    getNewQueries() {
      return data.localState.getIn(['newQueries']);
    },

    getNewQueriesIdsList() {
      return data.localState.getIn(['newQueriesIdsList'], List([]));
    },

    isEditingQuery(queryId) {
      return !!data.localState.getIn(['editingQueries', queryId]);
    },

    getEditingQuery(queryId) {
      return data.localState.getIn(['editingQueries', queryId]);
    },

    getEditingQueries() {
      return data.localState.getIn(['editingQueries']);
    },

    isSavingQuery(queryId) {
      return !!data.localState.getIn(['isSaving', queryId]);
    },

    isNewQuery(queryID) {
      return !!data.localState.getIn(['newQueries', queryID]);
    },

    isEditingQueryValid(queryId) {
      const query = this.getEditingQuery(queryId);
      if (!query) {
        return false;
      }
      return isValidQuery(query);
    },

    queryNameExists(query) {
      return !!this.getQueries().find((q) => q.get('name') === query.get('name') && q.get('id') !== query.get('id'));
    },

    getDefaultOutputTableId(name) {
      if (!name || name === '') {
        return '';
      }
      const qname = string.sanitizeKbcTableIdString(name).toLowerCase();
      const bucketName = string.sanitizeKbcTableIdString(componentId);
      const fullBucketName = `in.c-${bucketName}`;
      const fullBucketNameWithConfigSuffix = `${fullBucketName}-${configId}`;
      if (this.shouldDestinationHaveOldFormat(fullBucketName)) {
        return `${fullBucketName}.${qname}`;
      }
      return `${fullBucketNameWithConfigSuffix}.${qname}`;
    },

    shouldDestinationHaveOldFormat(fullBucketName) {
      if (data.parameters.get('tables', List()).count() === 0) {
        return false;
      }
      return data.parameters.get('tables', List()).filter((table) => {
        return table.get('outputTable').indexOf(fullBucketName + '.') === 0;
      }).count() === data.parameters.get('tables', List()).count();
    },

    getQueriesPendingActions() {
      return data.localState.getIn(['pending'], Map());
    },

    getQueriesFilter() {
      return data.localState.get('queriesFilter', '');
    },

    // -------- CONFIGDATA manipulation -----------------
    configData: data.config,

    getQueries() {
      return data.parameters.get('tables', List()).map((q) => {
        let pk = q.get('primaryKey', null);
        if (_.isEmpty(pk) || _.isString(pk)) {
          pk = List();
        }
        return q.set('primaryKey', pk);
      });
    },

    getQueriesFiltered() {
      const q = this.getQueriesFilter();
      return this.getQueries().filter( (query) => {
        return fuzzy.match(q, query.get('name')) ||
          fuzzy.match(q, query.get('outputTable'));
      }).sortBy((query) => query.get('name').toLowerCase());
    },

    getConfigQuery(qid) {
      if (this.isEditingQuery(qid)) {
        return this.getEditingQuery(qid);
      } else if (this.isNewQuery(qid)) {
        return this.getNewQuery(qid);
      }
      let query = this.getQueries().find((q) => q.get('id') === qid ) || this.generateNewQuery(qid);
      if (query.has('query')) {
        query = query.set('advancedMode', true);
      } else {
        query = query.set('advancedMode', false);
      }
      return query;
    },

    getQueryName(qid) {
      return this.getConfigQuery(qid).get('name');
    },

    getSourceTables() {
      return data.localState.getIn(sourceTablesPath);
    },

    getIncrementalCandidates() {
      return data.localState.getIn(incrementalCandidatesPath);
    },

    getSourceTablesLoading() {
      return !!data.localState.getIn(loadingSourceTablesPath);
    },

    getQuickstartTables() {
      return data.localState.getIn(['quickstart', 'tables']);
    },

    getLocalState() {
      return data.localState;
    },

    isRowConfiguration() {
      return data.configurationType === rowConfigurationType;
    }
  };
}
