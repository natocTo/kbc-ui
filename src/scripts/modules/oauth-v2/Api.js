import request from '../../utils/request';
import ApplicationStore from '../../stores/ApplicationStore';
import ComponentsStore from '../components/stores/ComponentsStore';

function createUrl(path) {
  const baseUrl = ComponentsStore.getComponent('keboola.oauth-v2').get('uri');
  return baseUrl + '/' + path;
}

function createRequest(method, path) {
  return request(method, createUrl(path))
    .set('X-StorageApi-Token', ApplicationStore.getSapiTokenString());
}

module.exports = {
  getCredentials: function(componentId, id) {
    return createRequest('GET', 'credentials/' + componentId + '/' + id)
      .promise().then(function(response) {
        return response.body;
      });
  },

  postCredentials: function(componentId, id, authorizedFor, data) {
    const body = {
      id: id,
      authorizedFor: authorizedFor,
      data: data
    };
    return createRequest('POST', 'credentials/' + componentId)
      .send(body)
      .promise().then(function(response) {
        return response.body;
      });
  },

  deleteCredentials: function(componentId, id) {
    return createRequest('DELETE', 'credentials/' + componentId + '/' + id)
      .promise().then(function(response) {
        return response.body;
      });
  }
};