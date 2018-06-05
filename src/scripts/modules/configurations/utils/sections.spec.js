import assert from 'assert';
import Immutable from 'immutable';
import sections from './sections';

describe('sections makeParseFn()', function() {
  const sectionsDefinition = Immutable.fromJS([
    {
      onLoad: function(configuration) {
        return Immutable.fromJS({
          key1: configuration.getIn(['parameters', 'key1'], '')
        });
      }
    },
    {
      onLoad: function(configuration) {
        return Immutable.fromJS({
          key2: configuration.getIn(['parameters', 'key2'], '')
        });
      }
    }
  ]);
  it('should map all valid values', function() {
    const parseFn = sections.makeParseFn(sectionsDefinition, null);
    const configuration = Immutable.fromJS({
      parameters: {
        key1: 'val1',
        key2: 'val2'
      }
    });
    const expected = [
      {
        key1: 'val1'
      },
      {
        key2: 'val2'
      }
    ];
    assert.deepEqual(expected, parseFn(configuration).toJS());
  });
  it('should not map invalid values', function() {
    const parseFn = sections.makeParseFn(sectionsDefinition, null);
    const configuration = Immutable.fromJS({
      parameters: {
        key1: 'val1',
        key2: 'val2',
        invalidKey: 'val3'
      }
    });
    const expected = [
      {
        key1: 'val1'
      },
      {
        key2: 'val2'
      }
    ];
    assert.deepEqual(expected, parseFn(configuration).toJS());
  });
});

describe('sections makeCreateFn()', function() {
  const sectionsDefinition = Immutable.fromJS([
    {
      onSave: function(localState) {
        return Immutable.fromJS({
          parameters: {
            key1: localState.get('key1', '')
          }
        });
      }
    },
    {
      onSave: function(localState) {
        return Immutable.fromJS({
          parameters: {
            key2: localState.get('key2', '')
          }
        });
      }
    }
  ]);
  it('should map all valid values', function() {
    const createFn = sections.makeCreateFn(sectionsDefinition);
    const localState = Immutable.fromJS([
      {
        key1: 'val1'
      },
      {
        key2: 'val2'
      }
    ]);
    const expected = {
      parameters: {
        key1: 'val1',
        key2: 'val2'
      }
    };
    assert.deepEqual(expected, createFn(localState).toJS());
  });
  it('should not map invalid values', function() {
    const createFn = sections.makeCreateFn(sectionsDefinition);
    const localState = Immutable.fromJS([
      {
        key1: 'val1',
        invalidKey1: 'val3'
      },
      {
        key2: 'val2',
        invalidKey2: 'val4'
      }
    ]);
    const expected = {
      parameters: {
        key1: 'val1',
        key2: 'val2'
      }
    };
    assert.deepEqual(expected, createFn(localState).toJS());
  });
});

describe('sections makeCreateEmptyFn()', function() {
  const sectionOnSave = function(localState) {
    return Immutable.fromJS({
      parameters: {
        key1: localState.get('key1', '')
      }
    });
  };
  const sectionsDefinition = Immutable.fromJS([
    {
      onCreate: function(name, webalized) {
        return sectionOnSave(Immutable.fromJS({key1: webalized}));
      },
      onSave: sectionOnSave
    },
    {
      onSave: function(localState) {
        return Immutable.fromJS({
          parameters: {
            key2: localState.get('key2', '')
          }
        });
      }
    }
  ]);
  it('should create valid empty config', function() {
    const createEmptyFn = sections.makeCreateEmptyFn(sectionsDefinition);
    const expected = {
      parameters: {
        key1: 'myWebalized',
        key2: ''
      }
    };
    assert.deepEqual(expected, createEmptyFn('myName', 'myWebalized').toJS());
  });
});

describe('sections isComplete', function() {
  const sectionsDefinition = Immutable.fromJS([
    {
      isComplete: function(configuration) {
        return configuration.getIn(['parameters', 'key1'], '') !== '';
      }
    },
    {
      isComplete: function(configuration) {
        return configuration.getIn(['parameters', 'key2'], '') !== '';
      }
    }
  ]);
  it('should return true for a complete config', function() {
    assert.equal(true, sections.isComplete(sectionsDefinition, Immutable.fromJS({
      parameters: {
        key1: 'val1',
        key2: 'val2'
      }
    })));
  });
  it('should return false for an empty config', function() {
    assert.equal(false, sections.isComplete(sectionsDefinition, Immutable.fromJS({})));
  });
  it('should return false for an incomplete complete config', function() {
    assert.equal(false, sections.isComplete(sectionsDefinition, Immutable.fromJS({
      parameters: {
        key1: '',
        key2: 'val2'
      }
    })));
    assert.equal(false, sections.isComplete(sectionsDefinition, Immutable.fromJS({
      parameters: {
        key1: 'val1',
        key2: ''
      }
    })));
  });
});

describe('sections parse(create())', function() {
  it('should simple merge', function() {
    const createBySectionsFn = sections.makeCreateFn(
      Immutable.fromJS([
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                key1: localState.get('key1', '')
              }
            });
          }
        },
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                key2: localState.get('key2', '')
              }
            });
          }
        }
      ])
    );
    const parseBySectionsFn = sections.makeParseFn(
      Immutable.fromJS([
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key1: configuration.getIn(['parameters', 'key1'], '')
            });
          }
        },
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key2: configuration.getIn(['parameters', 'key2'], '')
            });
          }
        }

      ]),
      null
    );
    const configuration = Immutable.fromJS({
      parameters: {
        key1: 'value1',
        key2: 'value2'
      }
    });
    assert.deepEqual(configuration.toJS(), createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });

  it('should deep merge', function() {
    const createBySectionsFn = sections.makeCreateFn(
      Immutable.fromJS([
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                nested: {
                  key1: localState.get('key1', '')
                }
              }
            });
          }
        },
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                nested: {
                  key2: localState.get('key2', '')
                }
              }
            });
          }
        }
      ])
    );
    const parseBySectionsFn = sections.makeParseFn(
      Immutable.fromJS([
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key1: configuration.getIn(['parameters', 'nested', 'key1'], '')
            });
          }
        },
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key2: configuration.getIn(['parameters', 'nested', 'key2'], '')
            });
          }
        }

      ]),
      null
    );
    const configuration = Immutable.fromJS({
      parameters: {
        nested: {
          key1: 'value1',
          key2: 'value2'
        }
      }
    });
    assert.deepEqual(configuration.toJS(), createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });

  it('unknown key shall not pass', function() {
    const createBySectionsFn = sections.makeCreateFn(
      Immutable.fromJS([
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                key: localState.get('key', '')
              }
            });
          }
        }
      ])
    );
    const parseBySectionsFn = sections.makeParseFn(
      Immutable.fromJS([
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key: configuration.getIn(['parameters', 'key'], '')
            });
          }
        }
      ]),
      null
    );
    const configuration = Immutable.fromJS({
      parameters: {
        key: 'value',
        invalidKey: 'invalidValue'
      }
    });
    const expected = {
      parameters: {
        key: 'value'
      }
    };
    assert.deepEqual(expected, createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });

  it('should aggressively conform parsed config with missing value', function() {
    const conformFn = (config) => config.setIn(['parameters', 'value'], true);
    const onLoad = (config)  => config;
    const onSave = (localState) => localState;
    const configuration = Immutable.fromJS({
      someValue: 1
    });
    const expected = {
      parameters: {
        value: true
      },
      someValue: 1
    };
    const rowSections = Immutable.fromJS([{onLoad, onSave}]);
    const parseBySectionsFn = sections.makeParseFn(rowSections, conformFn);
    const createBySectionsFn = sections.makeCreateFn(rowSections);
    assert.deepEqual(expected, createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });

  it('should conform parsed config with existing value', function() {
    const conformFn = (config) => config.set('value', config.get('value', 0));
    const onLoad = (config)  => config;
    const onSave = (localState) => localState;
    const configuration = Immutable.fromJS({
      someValue: 1,
      value: 43
    });
    const expected = {
      value: 43,
      someValue: 1
    };
    const rowSections = Immutable.fromJS([{onLoad, onSave}]);
    const parseBySectionsFn = sections.makeParseFn(rowSections, conformFn);
    const createBySectionsFn = sections.makeCreateFn(rowSections);
    assert.deepEqual(expected, createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });
});
