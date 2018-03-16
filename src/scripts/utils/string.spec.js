import assert from 'assert';
import stringUtils from './string';
const {webalize} = stringUtils;

describe('string utils tests', function() {
  describe('webalize', function() {
    it('jeden dva tri styri pat -> jeden-dva-tri-styri-pat', function() {
      assert.equal(webalize('jeden dva tri styri pat'), 'jeden-dva-tri-styri-pat');
    });
    it('jeden dva  Tri -> jeden-dva-tri', function() {
      assert.equal(webalize('jeden dva  Tri'), 'jeden-dva--tri');
    });
    it('Háčky a čárky NEdělají problémyô->hacky-a-carky-nedelaji-problemyo', function() {
      assert.equal(webalize('Háčky a čárky NEdělají problémyô'), 'hacky-a-carky-nedelaji-problemyo');
    });
    it('LaLaLa123->lalala123', function() {
      assert.equal(webalize('LaLaLa123'), 'lalala123');
    });
    it('a_b->ab', function() {
      assert.equal(webalize('a_b'), 'ab');
    });
  });
});
