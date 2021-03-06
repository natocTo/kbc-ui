var assert = require('assert');
var Immutable = require('immutable');
var templateFinder = require('./templateFinder');

var templates = Immutable.fromJS([
  {
    'data': {
      'boolKey': true,
      'objectKey': {
        'key1': 'val1',
        'key2': [1, 2, 3]
      },
      'arrayKey': [
        {
          'key1': 'val1'
        },
        {
          'key2': {
            'key3': 'val3'
          }
        }
      ]
    }
  },
  {
    'data': {
      'boolKey': false,
      'objectKey': {},
      'arrayKey': []
    }
  }
]);

describe('templateFinder', function() {
  describe('#templateFinder()', function() {
    it('should return 0 templates on empty config', function() {
      var config = Immutable.Map();
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 0 templates on config with no matching keys', function() {
      var config = Immutable.fromJS({'someotherKey': false});
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 0 templates on config with one matching key (of three)', function() {
      var config = Immutable.fromJS({'boolKey': true});
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 1 templates on match', function() {
      var config = Immutable.fromJS({
        'boolKey': false,
        'objectKey': {},
        'arrayKey': []
      });
      assert.equal(1, templateFinder(templates, config).count());
    });

    it('should return 0 templates on type mismatch', function() {
      var config = Immutable.fromJS({
        'boolKey': 0,
        'objectKey': {},
        'arrayKey': []
      });
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 0 templates on type mismatch', function() {
      var config = Immutable.fromJS({
        'boolKey': false,
        'objectKey': [],
        'arrayKey': []
      });
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 0 templates on type mismatch', function() {
      var config = Immutable.fromJS({
        'boolKey': false,
        'objectKey': {},
        'arrayKey': {}
      });
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 1 templates on deep match', function() {
      var config = Immutable.fromJS({
        'boolKey': true,
        'objectKey': {
          'key1': 'val1',
          'key2': [1, 2, 3]
        },
        'arrayKey': [
          {
            'key1': 'val1'
          },
          {
            'key2': {
              'key3': 'val3'
            }
          }
        ]
      });
      assert.equal(1, templateFinder(templates, config).count());
    });

    it('should return 0 templates on deep mismatch', function() {
      var config = Immutable.fromJS({
        'boolKey': true,
        'objectKey': {
          'key1': 'val1',
          'key2': [1, 2, 4]
        },
        'arrayKey': [
          {
            'key1': 'val1'
          },
          {
            'key2': {
              'key3': 'val3'
            }
          }
        ]
      });
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 0 templates on deep mismatch', function() {
      var config = Immutable.fromJS({
        'boolKey': true,
        'objectKey': {
          'key1': 'val1',
          'key2': [1, 2, 3]
        },
        'arrayKey': [
          {
            'key1': 'val1'
          },
          {
            'key2': {
              'key3': 'val4'
            }
          }
        ]
      });
      assert.equal(0, templateFinder(templates, config).count());
    });

    it('should return 0 templates on deep mismatch', function() {
      var config = Immutable.fromJS({
        'boolKey': true,
        'objectKey': {
          'key1': 'val1',
          'key2': [1, 2, 3]
        },
        'arrayKey': [
          {
            'key1': 'val1'
          },
          {
            'key2': {
              'key4': 'val3'
            }
          }
        ]
      });
      assert.equal(0, templateFinder(templates, config).count());
    });
  });
});
