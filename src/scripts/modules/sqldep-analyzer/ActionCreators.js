import Api from './Api';

module.exports = {
  getGraph: function(configurationId, transformationId) {
    return Api.getGraph(configurationId, transformationId).then(function(response) {
      return response.body;
    });
  }
};
