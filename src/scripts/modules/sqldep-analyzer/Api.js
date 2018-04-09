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

export default {
  getGraph(configurationId, transformationId) {
    return createRequest('POST', 'graph?configId=' + configurationId + '&rowId=' + transformationId)
      .promise().then(function(response) {
        return response.body;
      });
  }
};
