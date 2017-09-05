const regex = /\s*((?:'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'|"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\/|#.*|--.*|[^"';#])+(?:;|$))/g;
const re = new RegExp(regex, 'g');

self.addEventListener('message', function(e) {
  var data = e.data;
  const matches = data.queries.match(re);
  const response = matches
    .filter((line) => line.trim() !== '')
    .map((line) => line.trim());
  postMessage(response);
}, false);
