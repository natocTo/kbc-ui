import Api from './Api';

export default {
  getGraph(configurationId, transformationId) {
    return Api.getGraph(configurationId, transformationId).then(function(response) {
      return response.body;
    });
  },
  validate(configurationId, transformationId) {
    return Api.validate(configurationId, transformationId).then(function(response) {
      return response.body;
    });
  }
};
