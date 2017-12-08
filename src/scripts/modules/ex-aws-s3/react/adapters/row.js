var Immutable = require('immutable');

function createConfiguration(localState) {
  let skipLinesProcessor;
  let createManifestProcessor = {
    definition: {
      component: 'keboola.processor-create-manifest'
    },
    parameters: {
      delimiter: localState.get('delimiter', ','),
      enclosure: localState.get('enclosure', '"'),
      incremental: localState.get('incremental', false),
      primary_key: localState.get('primaryKey', Immutable.List()).toJS(),
      columns: []
    }
  };

  if (localState.get('columnsFrom', 'manual') === 'manual') {
    createManifestProcessor.parameters.columns = localState.get('columns', Immutable.List()).toJS();
  } else if (localState.get('columnsFrom') === 'auto') {
    createManifestProcessor.parameters.columns_from = 'auto';
  } else if (localState.get('columnsFrom') === 'header') {
    createManifestProcessor.parameters.columns_from = 'header';
    skipLinesProcessor = {
      definition: {
        component: 'processor-skip-lines'
      },
      parameters: {
        lines: 1
      }
    };
  }

  let config = {
    parameters: {
      bucket: localState.get('bucket', ''),
      key: localState.get('key', '') + (localState.get('wildcard', false) ? '*' : ''),
      saveAs: localState.get('name', ''),
      includeSubfolders: localState.get('subfolders', false),
      newFilesOnly: localState.get('newFilesOnly', false)
    },
    processors: {
      after: [
        {
          definition: {
            component: 'keboola.processor-move-files'
          },
          parameters: {
            direction: 'tables',
            addCsvSuffix: true
          }
        },
        createManifestProcessor
      ]
    }
  };
  if (skipLinesProcessor) {
    config.processors.after.push(skipLinesProcessor);
  }
  return config;
}

function parseConfiguration(configuration) {
  const configData = Immutable.fromJS(configuration);
  const key = configData.getIn(['parameters', 'key'], '');
  const isWildcard = key.slice(-1) === '*' ? true : false;
  return {
    bucket: configData.getIn(['parameters', 'bucket'], ''),
    key: isWildcard ? key.substring(0, key.length - 1) : key,
    name: configData.getIn(['parameters', 'saveAs'], ''),
    wildcard: isWildcard,
    subfolders: configData.getIn(['parameters', 'includeSubfolders'], false),
    incremental: configData.getIn(['processors', 'after', 1, 'parameters', 'incremental'], false),
    newFilesOnly: configData.getIn(['parameters', 'newFilesOnly'], false),
    primaryKey: configData.getIn(['processors', 'after', 1, 'parameters', 'primary_key'], Immutable.List()).toJS(),
    delimiter: configData.getIn(['processors', 'after', 1, 'parameters', 'delimiter'], ','),
    enclosure: configData.getIn(['processors', 'after', 1, 'parameters', 'enclosure'], '"'),
    columns: configData.getIn(['processors', 'after', 1, 'parameters', 'columns'], Immutable.List()).toJS(),
    columnsFrom: configData.getIn(['processors', 'after', 1, 'parameters', 'columns_from'], 'manual')
  };
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration
};
