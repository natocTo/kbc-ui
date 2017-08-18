import Promise from 'bluebird';
import request from './request';
const _pollStatuses = ['processing', 'waiting'];

module.exports = {
  poll: function(token, url, interval) {
    var timeOutInterval = 5000;
    if (parseInt(interval, 10) > 0) {
      timeOutInterval = interval;
    }
    return new Promise(function(resolve, reject) {
      var runRequest;
      runRequest = function() {
        return request('GET', url)
          .set('X-StorageApi-Token', token)
          .promise()
          .then(function(response) {
            if (_pollStatuses.indexOf(response.body.status) >= 0) {
              return setTimeout(runRequest, timeOutInterval);
            } else {
              if (response.body.status === 'error') {
                return reject(response.body);
              }
              return resolve(response.body);
            }
          }).catch(reject);
      };
      return runRequest();
    });
  }
};
