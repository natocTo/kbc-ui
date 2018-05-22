import assert from 'assert';
import stringUtils from './string';
const {webalize} = stringUtils;

describe('string utils tests', function() {
  describe('webalize', function() {
    it('jeden dva tri styri pat -> jeden-dva-tri-styri-pat', function() {
      assert.equal(webalize('jeden dva tri styri pat'), 'jeden-dva-tri-styri-pat');
    });
    it('jeden dva  Tri -> jeden-dva-tri', function() {
      assert.equal(webalize('jeden dva  Tri'), 'jeden-dva-tri');
    });
    it('jeden DVA  Tri -> jeden-DVA-Tri', function() {
      assert.equal(webalize('jeden DVA  Tri', {caseSensitive: true}), 'jeden-DVA-Tri');
    });
    it('Háčky a čárky NEdělají problémyô->hacky-a-carky-nedelaji-problemyo', function() {
      assert.equal(webalize('Háčky a čárky NEdělají problémyô'), 'hacky-a-carky-nedelaji-problemyo');
    });
    it('LaLaLa123->lalala123', function() {
      assert.equal(webalize('LaLaLa123'), 'lalala123');
    });
    it('a_b->a_b', function() {
      assert.equal(webalize('a_b'), 'a_b');
    });
    it('__a__b___c->a_b_c', function() {
      assert.equal(webalize('__a__b___c'), 'a_b_c');
    });
    it('_a_b_->a_b', function() {
      assert.equal(webalize('_a_b_'), 'a_b');
    });
  });
});
