import assert from 'assert';
import { Map } from 'immutable';
import { isJsonValid, isMappingValid, isValidQuery } from './storeProvisioning';

describe('mongodb export validation', function() {
  describe('validate json', function() {
    it('should return that json is valid for: {"a": "b"} ', function() {
      assert.equal(true, isJsonValid('{"a": "b"}'));
    });
    it('should return that json is not valid for: {"a": "b}', function() {
      assert.equal(false, isJsonValid('{"a": "b}'));
    });
    it('should return that json is not valid for: (empty string)', function() {
      assert.equal(false, isJsonValid(''));
    });
    it('should return that json is not valid', function() {
      assert.equal(false, isJsonValid(null));
    });
    it('should return that json is not valid', function() {
      assert.equal(false, isJsonValid());
    });
  });

  describe('validate mapping', function() {
    it('should return that mapping is valid for: {"a": "b"}', function() {
      assert.equal(true, isMappingValid('{"a": "b"}'));
    });
    it('should return that mapping is valid for Map({"a": "b"})', function() {
      assert.equal(true, isMappingValid(Map({'a': 'b'})));
    });
    it('should return that mapping is not valid for: {"a": "b}', function() {
      assert.equal(false, isMappingValid('{"a": "b}'));
    });
    it('should return that mapping is not valid for: (empty string)', function() {
      assert.equal(false, isMappingValid(''));
    });
  });

  describe('validate whole export', function() {
    it('should return that mapping is valid for Map({"name": "b", "collection": "b", "mode": "raw"})', function() {
      assert.equal(true, isValidQuery(Map({'name': 'b', 'collection': 'b', 'mode': 'raw'})));
    });
    it('should return that mapping is valid for Map({"name": "b", "collection": "b", "mapping": Map({"a": "b"})})', function() {
      assert.equal(true, isValidQuery(Map({'name': 'b', 'collection': 'b', 'mapping': Map({'a': 'b'})})));
    });
    it('should return that mapping is valid for Map({"name": "b", "collection": "b", "mapping": \'{"a": "b"}\'})', function() {
      assert.equal(true, isValidQuery(Map({'name': 'b', 'collection': 'b', 'mapping': '{"a": "b"}'})));
    });
    it('should return that mapping is not valid for Map({"name": "b", "collection": "b"})', function() {
      assert.equal(false, isValidQuery(Map({'name': 'b', 'collection': 'b'})));
    });
  });
});
