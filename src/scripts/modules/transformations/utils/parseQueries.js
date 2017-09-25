import Promise from 'bluebird';

const maxSqlExecutionTime = 2000;

export default function(queries) {
  return new Promise(function(resolve, reject) {
    const worker = require('worker-loader?inline!./splitSqlQueriesWorker.js')();
    let success = false;
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
}
