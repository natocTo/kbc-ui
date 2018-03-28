import {Map} from 'immutable';
export default {
  createConfiguration(localState) {
    return localState.get('dimensions');
  },

  parseConfiguration(configuration) {
    const params = configuration.get('parameters', Map());
    return Map({
      dimensions: params.get('dimensions', '')
    });
  }
};
