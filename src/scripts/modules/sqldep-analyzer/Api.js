import request from '../../utils/request';
import ApplicationStore from '../../stores/ApplicationStore';
import ServicesStore from '../services/Store';

function createUrl(path) {
  const baseUrl = ServicesStore.getService('sqldep-analyzer').get('url');
  return baseUrl + '/' + path;
}

function createRequest(method, path) {
  return request(method, createUrl(path))
    .set('X-StorageApi-Token', ApplicationStore.getSapiTokenString());
}

module.exports = {
  getGraph: function(configurationId, transformationId) {
    return createRequest('POST', configurationId + '/' + transformationId + '/graph')
      .promise().then(function(response) {
        return response.body;
      });
  }
};
