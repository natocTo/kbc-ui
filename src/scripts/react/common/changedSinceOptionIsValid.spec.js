var assert = require('assert');
var changedSinceInputIsValid = require('./changedSinceOptionIsValid');

describe('changedSinceInputIsValid', function() {
  describe('valid options', function() {
    it('1 minute', function() {
      assert.equal(true, changedSinceInputIsValid('1 minute'));
    });
    it('2 minutes', function() {
      assert.equal(true, changedSinceInputIsValid('2 minutes'));
    });
    it('100 minutes', function() {
      assert.equal(true, changedSinceInputIsValid('100 minutes'));
    });
    it('1 hour', function() {
      assert.equal(true, changedSinceInputIsValid('1 hour'));
    });
    it('2 hours', function() {
      assert.equal(true, changedSinceInputIsValid('2 hours'));
    });
    it('100 hours', function() {
      assert.equal(true, changedSinceInputIsValid('100 hours'));
    });
    it('1 day', function() {
      assert.equal(true, changedSinceInputIsValid('1 day'));
    });
    it('2 days', function() {
      assert.equal(true, changedSinceInputIsValid('2 days'));
    });
    it('100 days', function() {
      assert.equal(true, changedSinceInputIsValid('100 days'));
    });
  });

  describe('invalid options', function() {
    it('invalid', function() {
      assert.equal(false, changedSinceInputIsValid('invalid'));
    });
    it('empty string', function() {
      assert.equal(false, changedSinceInputIsValid(''));
    });
    it('null', function() {
      assert.equal(false, changedSinceInputIsValid(null));
    });
    it('a b', function() {
      assert.equal(false, changedSinceInputIsValid('a b'));
    });
    it('1 2', function() {
      assert.equal(false, changedSinceInputIsValid('1 2'));
    });

    it('number', function() {
      assert.equal(false, changedSinceInputIsValid(10));
    });
    it('object', function() {
      assert.equal(false, changedSinceInputIsValid({a: 'b'}));
    });
    it('array', function() {
      assert.equal(false, changedSinceInputIsValid([1, 'minutes']));
    });
    it('-1 minutes', function() {
      assert.equal(false, changedSinceInputIsValid('-1 minutes'));
    });
    it('0 minutes', function() {
      assert.equal(false, changedSinceInputIsValid('0 minutes'));
    });
    it('1 minutes', function() {
      assert.equal(false, changedSinceInputIsValid('1 minutes'));
    });
    it('1 hours', function() {
      assert.equal(false, changedSinceInputIsValid('1 hours'));
    });
    it('1 days', function() {
      assert.equal(false, changedSinceInputIsValid('1 days'));
    });
    it('1 seconds', function() {
      assert.equal(false, changedSinceInputIsValid('0 seconds'));
    });
  });
});
