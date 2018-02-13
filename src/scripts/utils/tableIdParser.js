function parseTableId(tableId, defaultStage) {
  const parts = tableId.match(/^(in|out)\.(.+)?\.(.+)?$/);
  return {
    stage: parts ? parts[1]  : defaultStage,
    bucket: parts ? (parts[2] || '') : '',
    table: parts ? (parts[3]  || '') : ''
  };
}

export function parse(tableId, options = {}) {
  const parts = parseTableId(tableId || '', options.defaultStage || '');
  return {
    tableId: tableId,
    parts,
    setPart: (partNameToSet, value) => {
      const result = ['stage', 'bucket', 'table'].reduce((memo, partName) =>
        partName === partNameToSet ? `${memo}.${value}` : `${memo}.${parts[partName]}`, '').slice(1);
      return parse(result);
    }
  };
}

export default {parse: parse};