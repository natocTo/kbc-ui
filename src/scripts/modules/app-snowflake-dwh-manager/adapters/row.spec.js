import assert from 'assert';
import Immutable from 'immutable';
import { createConfiguration, parseConfiguration } from './row';
import { cases } from './row.spec.def';

describe('row', function() {
  describe('createConfiguration()', function() {
    Object.keys(cases).forEach(function(key) {
      it('should return a valid config for a local state with ' + key, function() {
        assert.deepEqual(cases[key].configuration, createConfiguration(Immutable.fromJS(cases[key].localState)).toJS());
      });
    });
  });

  describe('parseConfiguration()', function() {
    Object.keys(cases).forEach(function(key) {
      it('should return a correct localState with ' + key + ' configuration', function() {
        assert.deepEqual(cases[key].localState, parseConfiguration(Immutable.fromJS(cases[key].configuration)).toJS());
      });
    });
  });
});
