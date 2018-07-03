import makeColumnDefinition from './makeColumnDefinition';
import {Types} from './constants';
import assert from 'assert';

describe('makeColumnDefinition', () => {
  it('test type STRING setup', () => {
    const definition = makeColumnDefinition({
      name: 'id',
      dbName: 'id',
      type: Types.STRING
    });
    assert.deepEqual(definition.fields.name, {
      show: false,
      defaultValue: 'id'
    });
    assert.deepEqual(definition.fields.dbName, {
      show: true,
      defaultValue: 'id'
    });
    assert.deepEqual(definition.fields.type, {
      show: true,
      defaultValue: Types.IGNORE
    });
  });
});
