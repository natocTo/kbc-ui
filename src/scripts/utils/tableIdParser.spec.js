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

  it('should parse table with missing bucket', function() {
    const parsed = parse('in..table', {defaultStage: 'out'});
    assert.equal('in..table', parsed.tableId);
    const {stage, bucket, table} = parsed.parts;
    assert.equal('in', stage);
    assert.equal('', bucket);
    assert.equal('table', table);
  });

  it('should parse bucket with missing table', function() {
    const parsed = parse('in.bucket.', {defaultStage: 'out'});
    assert.equal('in.bucket.', parsed.tableId);
    const {stage, bucket, table} = parsed.parts;
    assert.equal('in', stage);
    assert.equal('bucket', bucket);
    assert.equal('', table);
  });

  it('should parse whole tableId', function() {
    const parsed = parse('in.bucket.table');
    assert.equal('in.bucket.table', parsed.tableId);
    const {stage, bucket, table} = parsed.parts;
    assert.equal('in', stage);
    assert.equal('bucket', bucket);
    assert.equal('table', table);
  });
});