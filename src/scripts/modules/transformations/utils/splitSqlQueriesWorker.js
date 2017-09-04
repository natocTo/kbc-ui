/**
 * Taken and modified from
 * http://stackoverflow.com/questions/4747808/split-mysql-queries-in-array-each-queries-separated-by/5610067#5610067
 * @param {string} queries SQL queries
 * @return {Object} List of queries
 */
const regex = /\s*((?:'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\/|#.*|--.*|[^"';#])+(?:;|$))/g;
const re = new RegExp(regex, 'g');

self.addEventListener('message', function(e) {
  var data = e.data;
  const matches = data.queries.match(re);
  const response = matches
    .filter((line) => line.trim() !== '')
    .map((line) => line.trim());
  postMessage(response);
}, false);
