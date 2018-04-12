var assert = require('assert');
var changedSinceOptionCreator = require('./changedSinceOptionCreator');

describe('changedSinceOptionCreator', function() {
  describe('valid options', function() {
    it('1m', function() {
      assert.equal('1 minute', changedSinceOptionCreator('1m'));
    });
    it('2m', function() {
      assert.equal('2 minutes', changedSinceOptionCreator('2m'));
    });
    it('1h', function() {
      assert.equal('1 hour', changedSinceOptionCreator('1h'));
    });
    it('2h', function() {
      assert.equal('2 hours', changedSinceOptionCreator('2h'));
    });
    it('1d', function() {
      assert.equal('1 day', changedSinceOptionCreator('1d'));
    });
    it('2d', function() {
      assert.equal('2 days', changedSinceOptionCreator('2d'));
    });
    it('1 m', function() {
      assert.equal('1 minute', changedSinceOptionCreator('1 m'));
    });
    it('1min', function() {
      assert.equal('1 minute', changedSinceOptionCreator('1min'));
    });
    it('-1m', function() {
      assert.equal('1 minute', changedSinceOptionCreator('-1m'));
    });
  });

  describe('invalid options', function() {
    it('invalid', function() {
      assert.equal(false, changedSinceOptionCreator('invalid'));
    });
    it('empty string', function() {
      assert.equal(false, changedSinceOptionCreator(''));
    });
    it('null', function() {
      assert.equal(false, changedSinceOptionCreator(null));
    });
    it('a b', function() {
      assert.equal(false, changedSinceOptionCreator('a b'));
    });
    it('1 2', function() {
      assert.equal(false, changedSinceOptionCreator('1 2'));
    });
    it('1', function() {
      assert.equal(false, changedSinceOptionCreator('1'));
    });
    it('number', function() {
      assert.equal(false, changedSinceOptionCreator(10));
    });
    it('object', function() {
      assert.equal(false, changedSinceOptionCreator({a: 'b'}));
    });
    it('array', function() {
      assert.equal(false, changedSinceOptionCreator([1, 'minutes']));
    });
    it('0 minutes', function() {
      assert.equal(false, changedSinceOptionCreator('0 minutes'));
    });
    it('1 minutes', function() {
      assert.equal(false, changedSinceOptionCreator('1 minutes'));
    });
    it('1 hours', function() {
      assert.equal(false, changedSinceOptionCreator('1 hours'));
    });
    it('1 days', function() {
      assert.equal(false, changedSinceOptionCreator('1 days'));
    });
    it('1 seconds', function() {
      assert.equal(false, changedSinceOptionCreator('1 seconds'));
    });
    it('0 seconds', function() {
      assert.equal(false, changedSinceOptionCreator('0 seconds'));
    });
  });
});
