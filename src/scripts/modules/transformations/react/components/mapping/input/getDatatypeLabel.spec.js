var assert = require('assert');
var Immutable = require('immutable');
var getDatatypeLabel = require('./getDatatypeLabel');

describe('getDatatypeLabel', function() {
  describe('#getDatatypeLabel()', function() {
    it('should return string', function() {
      assert.equal('test', getDatatypeLabel('test'));
    });

    it('should return VARCHAR', function() {
      const definition = Immutable.fromJS({
        type: 'VARCHAR'
      });
      assert.equal('VARCHAR', getDatatypeLabel(definition));
    });

    it('should return VARCHAR', function() {
      const definition = Immutable.fromJS({
        type: 'VARCHAR',
        length: null,
        compression: null
      });
      assert.equal('VARCHAR', getDatatypeLabel(definition));
    });

    it('should return VARCHAR(255)', function() {
      const definition = Immutable.fromJS({
        type: 'VARCHAR',
        length: '255'
      });
      assert.equal('VARCHAR(255)', getDatatypeLabel(definition));
    });

    it('should return VARCHAR(255) ENCODE LZO', function() {
      const definition = Immutable.fromJS({
        type: 'VARCHAR',
        length: '255',
        compression: 'LZO'
      });
      assert.equal('VARCHAR(255) ENCODE LZO', getDatatypeLabel(definition));
    });
  });
});
