var Immutable = require('immutable');

function createConfiguration(localState) {
  let skipLinesProcessor;
  let decompressProcessor;
  let createManifestProcessor = Immutable.fromJS({
    definition: {
      component: 'keboola.processor-create-manifest'
    },
    parameters: {
      delimiter: localState.get('delimiter', ','),
      enclosure: localState.get('enclosure', '"'),
      incremental: localState.get('incremental', false),
      primary_key: localState.get('primaryKey', Immutable.List()),
      columns: Immutable.List()
    }
  });

  if (localState.get('columnsFrom', 'manual') === 'manual') {
    createManifestProcessor = createManifestProcessor.setIn(['parameters', 'columns'], localState.get('columns', Immutable.List()));
  } else if (localState.get('columnsFrom') === 'auto') {
    createManifestProcessor = createManifestProcessor.setIn(['parameters', 'columns_from'], 'auto');
  } else if (localState.get('columnsFrom') === 'header') {
    createManifestProcessor = createManifestProcessor.setIn(['parameters', 'columns_from'], 'header');
    skipLinesProcessor = Immutable.fromJS({
      definition: {
        component: 'keboola.processor-skip-lines'
      },
      parameters: {
        lines: 1
      }
    });
  }

  if (localState.get('decompress', false) === true) {
    decompressProcessor = Immutable.fromJS({
      definition: {
        component: 'keboola.processor-decompress'
      }
    });
  }

  let config = Immutable.fromJS({
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
  });

  let processors = Immutable.List([]);

  if (decompressProcessor) {
    processors = processors.push(decompressProcessor);
  }

  processors = processors.push(Immutable.fromJS(
    {
      definition: {
        component: 'keboola.processor-move-files'
      },
      parameters: {
        direction: 'tables',
        addCsvSuffix: true
      }
    }
  ))
    .push(createManifestProcessor);

  if (skipLinesProcessor) {
    processors = processors.push(skipLinesProcessor);
  }

  config = config.setIn(['processors', 'after'], processors);

  return config;
}

function parseConfiguration(configuration) {
  const key = configuration.getIn(['parameters', 'key'], '');
  const isWildcard = key.slice(-1) === '*' ? true : false;
  const processorCreateManifest = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(['definition', 'component']) === 'keboola.processor-create-manifest';
  }, null, Immutable.Map());
  const processorDecompress = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(['definition', 'component']) === 'keboola.processor-decompress';
  });
  return Immutable.fromJS({
    bucket: configuration.getIn(['parameters', 'bucket'], ''),
    key: isWildcard ? key.substring(0, key.length - 1) : key,
    name: configuration.getIn(['parameters', 'saveAs'], ''),
    wildcard: isWildcard,
    subfolders: configuration.getIn(['parameters', 'includeSubfolders'], false),
    incremental: processorCreateManifest.getIn(['parameters', 'incremental'], false),
    newFilesOnly: configuration.getIn(['parameters', 'newFilesOnly'], false),
    primaryKey: processorCreateManifest.getIn(['parameters', 'primary_key'], Immutable.List()).toJS(),
    delimiter: processorCreateManifest.getIn(['parameters', 'delimiter'], ','),
    enclosure: processorCreateManifest.getIn(['parameters', 'enclosure'], '"'),
    columns: processorCreateManifest.getIn(['parameters', 'columns'], Immutable.List()).toJS(),
    columnsFrom: processorCreateManifest.getIn(['parameters', 'columns_from'], 'manual'),
    decompress: processorDecompress ? true : false
  });
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration
};
