const coffee = require('coffee-script');
const babelJest = require('babel-jest');

module.exports = {
  process: (src, path) => {
    if (path.match(/\.coffee$/)) {
      return coffee.compile(src, { bare: true });
    } else {
      return babelJest.process(src, path);
    }
  }
};
