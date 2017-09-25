const maxSqlExecutionTime = 2000;
import Promise from 'bluebird';

export default function(queries) {
  var promise = new Promise(function(resolve, reject) {
    const worker = require('worker-loader?inline!./splitSqlQueriesWorker.js')();
    var success = false;
    worker.onmessage = function(e) {
      if (e.data !== null) {
        success = true;
        resolve(e.data);
      }
    };
    worker.postMessage({
      queries: queries
    });
    setTimeout(function() {
      if (!success) {
        reject();
      }
      worker.terminate();
    }, maxSqlExecutionTime);
  });
  return promise;
}
