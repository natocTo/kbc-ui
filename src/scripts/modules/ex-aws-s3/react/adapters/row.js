var Immutable = require('immutable');

function createConfiguration(localState) {
  let skipLinesProcessor;
  let decompressProcessor;
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
        component: 'keboola.processor-skip-lines'
      },
      parameters: {
        lines: 1
      }
    };
  }

  if (localState.get('decompress', false) === true) {
    decompressProcessor = {
      definition: {
        component: 'keboola.processor-decompress'
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
      after: []
    }
  };

  if (decompressProcessor) {
    config.processors.after.push(decompressProcessor);
  }

  config.processors.after.push({
    definition: {
      component: 'keboola.processor-move-files'
    },
    parameters: {
      direction: 'tables',
      addCsvSuffix: true
    }
  });

  config.processors.after.push(createManifestProcessor);

  if (skipLinesProcessor) {
    config.processors.after.push(skipLinesProcessor);
  }

  return config;
}

function parseConfiguration(configuration) {
  const configData = Immutable.fromJS(configuration);
  const key = configData.getIn(['parameters', 'key'], '');
  const isWildcard = key.slice(-1) === '*' ? true : false;
  const processorCreateManifest = configData.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(["definition", "component"]) === 'keboola.processor-create-manifest';
  }, null, Immutable.Map());
  const processorDecompress = configData.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(["definition", "component"]) === 'keboola.processor-decompress';
  });
  return {
    bucket: configData.getIn(['parameters', 'bucket'], ''),
    key: isWildcard ? key.substring(0, key.length - 1) : key,
    name: configData.getIn(['parameters', 'saveAs'], ''),
    wildcard: isWildcard,
    subfolders: configData.getIn(['parameters', 'includeSubfolders'], false),
    incremental: processorCreateManifest.getIn(['parameters', 'incremental'], false),
    newFilesOnly: configData.getIn(['parameters', 'newFilesOnly'], false),
    primaryKey: processorCreateManifest.getIn(['parameters', 'primary_key'], Immutable.List()).toJS(),
    delimiter: processorCreateManifest.getIn(['parameters', 'delimiter'], ','),
    enclosure: processorCreateManifest.getIn(['parameters', 'enclosure'], '"'),
    columns: processorCreateManifest.getIn(['parameters', 'columns'], Immutable.List()).toJS(),
    columnsFrom: processorCreateManifest.getIn(['parameters', 'columns_from'], 'manual'),
    decompress: processorDecompress ? true : false
  };
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration
};
