var Immutable = require('immutable');

function createConfiguration(localState) {
  var mapping = {};

  mapping.incremental = localState.get('incremental', false);
  mapping.delimiter = localState.get('delimiter', ',');
  mapping.enclosure = localState.get('enclosure', '"');


  const config = {
    storage: {
      output: {
        tables: [
          mapping
        ]
      }
    }
  };
  return config;
}


function parseConfiguration(configuration) {
  const configData = Immutable.fromJS(configuration);
  return {
    incremental: configData.getIn(['storage', 'output', 'tables', 0, 'incremental'], false),
    delimiter: configData.getIn(['storage', 'output', 'tables', 0, 'delimiter'], ','),
    enclosure: configData.getIn(['storage', 'output', 'tables', 0, 'enclosure'], '"')
  };
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration
};
