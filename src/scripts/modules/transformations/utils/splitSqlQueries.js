import {List} from 'immutable';

/**
 * Taken and modified from
 * http://stackoverflow.com/questions/4747808/split-mysql-queries-in-array-each-queries-separated-by/5610067#5610067
 * @param {string} queries SQL queries
 * @return {Object} List of queries
 */
export default function splitSqlQueries(queries) {
  const regex = /\s*((?:'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'|"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\/|#.*|--.*|[^"';#])+(?:;|$))/g;
  const re = new RegExp(regex, 'g');
  const matches = queries.match(re);
  return List(matches)
    .filter((line) => line.trim() !== '')
    .map((line) => line.trim());
}
