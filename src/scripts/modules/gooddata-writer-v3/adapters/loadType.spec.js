import assert from 'assert';
import {fromJS} from 'immutable';
import loadType from './loadType';
import {Types} from '../helpers/Constants';

const tableId = 'in.some.table';
function makeParameters(body = {}) {
  return {
    tables: {
      [tableId]: body
    }
  };
}

function inputMapping(mapping = {}) {
  return {
    input: {
      tables: [
        {...mapping}
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
      storage: inputMapping({changed_since: '', incremental: false}),
      parameters: makeParameters({grain: null})
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
      storage: inputMapping({changed_since: '', incremental: false}),
      parameters: makeParameters({
        columns: {
          'a': {type: Types.ATTRIBUTE, title: 'a'},
          'b': {type: Types.ATTRIBUTE, title: 'b'},
          'c': {type: Types.ATTRIBUTE, title: 'c'}
        },
        grain: ['a', 'b']
      })
    },
    configurationToCreate: {
      storage: inputMapping({changed_since: '', incremental: false}),
      parameters: makeParameters({
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
      parameters: makeParameters({grain: null})
    }

  }
};


describe('load type adapter tests', () => {
  const casesKeys = Object.keys(casesDefinition);
  casesKeys.forEach(caseName => {
    const {localState, configuration, configurationToCreate} = casesDefinition[caseName];
    const parsed = loadType.parseConfiguration(fromJS(configuration));
    const reconstructed = loadType.createConfiguration(parsed);
    it('should test parse of ' + caseName + ' case', () => {
      assert.deepEqual(localState, parsed.toJS());
    });
    it('should test create of ' + caseName + ' case', () => {
      assert.deepEqual(configurationToCreate || configuration, reconstructed.toJS());
    });
  });
});
