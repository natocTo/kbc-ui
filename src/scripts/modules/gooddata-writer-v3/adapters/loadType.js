import {Map} from 'immutable';

export default {
  createConfiguration: (localState) => localState,
  parseConfiguration(rootParsedConfiguration) {
    const hasFact = rootParsedConfiguration.get('columns').find(c => c.get('type') === 'fact');
    return Map({
      hasFact,
      incrementalLoad: rootParsedConfiguration.get('incrementalLoad', 0),
      grain: rootParsedConfiguration.get('grain', null)
    });
  }
};
