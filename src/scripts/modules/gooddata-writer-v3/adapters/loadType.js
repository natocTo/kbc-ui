import {Map} from 'immutable';

export default {
  createConfiguration: (localState) => localState,
  parseConfiguration(rootParsedConfiguration) {
    return Map({
      incrementalLoad: rootParsedConfiguration.get('incrementalLoad', 0),
      grain: rootParsedConfiguration.get('grain', null)
    });
  }
};
