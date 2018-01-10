import ApplicationStore from '../../stores/ApplicationStore';

import request from '../../utils/request';

export default function() {
  const requestEmail = function() {
    const sapiToken = ApplicationStore.getSapiTokenString();
    return request('POST', 'https://docker-runner.keboola.com/docker/keboola.ex-pigeon/action/add')
        .set('X-StorageApi-Token', sapiToken)
        .send('{"configData": {"parameters": {}}}')
        .promise()
        .then(response => response.email);
  };

  return {
    requestEmail: requestEmail
  };
}