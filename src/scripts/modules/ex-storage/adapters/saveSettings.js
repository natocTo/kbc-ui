import Immutable from 'immutable';

const createConfiguration = function(localState) {
  let createManifestProcessor = Immutable.fromJS({
    definition: {
      component: 'keboola.processor-create-manifest'
    },
    parameters: {
      incremental: localState.get('incremental', false),
      primary_key: localState.get('primaryKey', Immutable.List())
    }
  });

  let config = Immutable.Map();
  let processors = Immutable.List();
  processors = processors.push(createManifestProcessor);
  config = config.setIn(['processors', 'after'], processors);
  return config;
};

const parseConfiguration = function(configuration) {
  const processorCreateManifest = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor) {
    return processor.getIn(['definition', 'component']) === 'keboola.processor-create-manifest';
  }, null, Immutable.Map());

  return Immutable.fromJS({
    incremental: processorCreateManifest.getIn(['parameters', 'incremental'], false),
    primaryKey: processorCreateManifest.getIn(['parameters', 'primary_key'], Immutable.List()).toJS()
  });
};

const createEmptyConfiguration = function() {
  return createConfiguration(Immutable.fromJS({}));
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyConfiguration: createEmptyConfiguration
};
