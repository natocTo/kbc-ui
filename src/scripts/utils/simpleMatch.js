module.exports = function(query, test) {
  return test.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) >= 0;
};
