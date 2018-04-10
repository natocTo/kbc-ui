import {Map, fromJS} from 'immutable';
export default {
  createConfiguration(localState) {
    return fromJS({parameters: {dimensions: localState.get('dimensions')}});
  },

  parseConfiguration(configuration) {
    const params = configuration.get('parameters', Map());
    return Map({
      dimensions: params.get('dimensions', '')
    });
  }
};
