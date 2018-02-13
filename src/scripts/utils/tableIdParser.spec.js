import assert from 'assert';
import {parse} from './tableIdParser';

describe('tableIdParser', () => {
  it('should parse null input', function() {
    const parsed = parse(null);
    assert.equal('..', parsed.tableId);
    const {stage, bucket, table} = parsed.parts;
    assert.equal('', stage);
    assert.equal('', bucket);
    assert.equal('', table);
  });
  it('should parse null input with default stage', function() {
    const parsed = parse(null, {defaultStage: 'out'});
    assert.equal('out..', parsed.tableId);
    const {stage, bucket, table} = parsed.parts;
    assert.equal('out', stage);
    assert.equal('', bucket);
    assert.equal('', table);
  });
});