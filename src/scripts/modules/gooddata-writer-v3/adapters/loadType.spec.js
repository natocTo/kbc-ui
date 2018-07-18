import assert from 'assert';
import {fromJS} from 'immutable';
import loadType from './loadType';
import {Types} from '../helpers/Constants';

const tableId = 'in.some.table';
function makeParameters(body = {}) {
  const params = {
    tables: {
      [tableId]: body
    }
  };
  params.tables[tableId] = body;
  return params;
}

function inputMapping(mapping = {}) {
  return {
    input: {
      tables: [
        {...mapping, source: tableId}
      ]
    }
  };
}
const casesDefinition = {
  empty: {
    localState: {
      grainColumns: [],
      hasConnectionPoint: false,
      tableId: tableId,
      incremental: false,
      changedSince: '',
      grain: []
    },
    configuration: {
      storage: inputMapping({}),
      parameters: makeParameters({})
    }
  },

  columns: {
    localState: {
      grainColumns: ['a', 'b', 'c'],
      hasConnectionPoint: false,
      tableId: tableId,
      incremental: false,
      changedSince: '',
      grain: ['a', 'b']
    },
    configuration: {
      storage: inputMapping({columns: ['a', 'b', 'c']}),
      parameters: makeParameters({
        columns: {
          'a': {type: Types.ATTRIBUTE, title: 'a'},
          'b': {type: Types.ATTRIBUTE, title: 'b'},
          'c': {type: Types.ATTRIBUTE, title: 'c'}
        },
        grain: ['a', 'b']
      })
    }
  },

  incrementalLoad: {
    localState: {
      grainColumns: [],
      hasConnectionPoint: false,
      tableId: tableId,
      incremental: true,
      changedSince: '5 days ago',
      grain: []

    },
    configuration: {
      storage: inputMapping({incremental: true, changed_since: '5 days ago'}),
      parameters: makeParameters({})
    }

  }
};


describe('load type adapter tests', () => {
  const casesKeys = Object.keys(casesDefinition);
  casesKeys.forEach(caseName => {
    const {localState, configuration} = casesDefinition[caseName];
    it('should test parse/create of ' + caseName + ' case', () => {
      const parsed = loadType.parseConfiguration(fromJS(configuration)).toJS();
      assert.deepEqual(localState, parsed);
    });
  });
});
