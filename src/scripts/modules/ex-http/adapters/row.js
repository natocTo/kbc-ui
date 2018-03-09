import Immutable from 'immutable';

function createConfiguration(localState) {
  let skipLinesProcessor;
  let decompressProcessor;
  let flattenFoldersProcessor;
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
    flattenFoldersProcessor = Immutable.fromJS({
      definition: {
        component: 'keboola.processor-flatten-folders'
      },
      parameters: {
        starting_depth: 1
      }
    });
  }

  let config = Immutable.fromJS({
    parameters: {
      path: localState.get('path', '')
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
        folder: localState.get('name', '')
      }
    }
  ));
  if (flattenFoldersProcessor) {
    processors = processors.push(flattenFoldersProcessor);
  }
  processors = processors.push(createManifestProcessor);

  if (skipLinesProcessor) {
    processors = processors.push(skipLinesProcessor);
  }

  config = config.setIn(['processors', 'after'], processors);

  return config;
}

function parseConfiguration(configuration) {
  const processorCreateManifest = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(['definition', 'component']) === 'keboola.processor-create-manifest';
  }, null, Immutable.Map());
  const processorDecompress = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(['definition', 'component']) === 'keboola.processor-decompress';
  });
  const moveFilesProcessor = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(['definition', 'component']) === 'keboola.processor-move-files';
  }, null, Immutable.Map());

  return Immutable.fromJS({
    path: configuration.getIn(['parameters', 'path'], ''),
    name: moveFilesProcessor.getIn(['parameters', 'folder'], ''),
    incremental: processorCreateManifest.getIn(['parameters', 'incremental'], false),
    primaryKey: processorCreateManifest.getIn(['parameters', 'primary_key'], Immutable.List()).toJS(),
    delimiter: processorCreateManifest.getIn(['parameters', 'delimiter'], ','),
    enclosure: processorCreateManifest.getIn(['parameters', 'enclosure'], '"'),
    columns: processorCreateManifest.getIn(['parameters', 'columns'], Immutable.List()).toJS(),
    columnsFrom: processorCreateManifest.getIn(['parameters', 'columns_from'], 'manual'),
    decompress: processorDecompress ? true : false
  });
}

function createEmptyConfiguration(name, webalizedName) {
  return createConfiguration(Immutable.fromJS({name: webalizedName}));
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyConfiguration: createEmptyConfiguration
};
