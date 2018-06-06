import Immutable from 'immutable';

export default function(configuration) {
  let conformedConfiguration = configuration;

  // remove columns array from processor-create-manifest when columns_from is set
  let processorCreateManifestKey = null;
  let processorCreateManifest = configuration.getIn(['processors', 'after'], Immutable.List()).find(function(processor, key) {
    processorCreateManifestKey = key;
    return processor.getIn(['definition', 'component']) === 'keboola.processor-create-manifest';
  });
  if (processorCreateManifest) {
    if (processorCreateManifest.hasIn(['parameters', 'columns_from']) && processorCreateManifest.hasIn(['parameters', 'columns'])) {
      processorCreateManifest = processorCreateManifest.removeIn(['parameters', 'columns']);
      conformedConfiguration = conformedConfiguration.setIn(['processors', 'after', processorCreateManifestKey], processorCreateManifest);
    }
  }

  return conformedConfiguration;
}
