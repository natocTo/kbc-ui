import Api from './Api';

export default {
  getGraph(configurationId, transformationId) {
    return Api.getGraph(configurationId, transformationId).then(function(response) {
      return response.body;
    });
  }
};
