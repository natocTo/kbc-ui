import {Types} from './constants';

// export const mustHave;
/*
function checkEmpty(value, label) {
  return !value && ((label || 'Value') + ' can not be empty');
}

function checkDataTypeSize(dataType, dataTypeSize) {
  if (dataType === DataTypes.VARCHAR && isNaN(dataTypeSize)) {
    return 'Data size must by valid number: ' + dataTypeSize;
  }
  if (dataType === DataTypes.DECIMAL && !/^\d+,\d+$/.test(dataTypeSize)) {
    return 'Ivalid decimal format' + dataTypeSize;
  }
  return false;
}
*/

function prepareFields(column) {
  return {
    type: {
      show: true,
      defaultValue: Types.IGNORE
    },
    dbName: {
      show: true,
      defaultValue: column.name
    },
    name: {
      show: false,
      defaultValue: column.name
    }
  };
}

function makeColumnWithDefaults(fields, column) {
  return Object.keys(fields).reduce((memo, field) => {
    const defaultValue = fields[field].defaultValue;
    if (defaultValue && !memo[field]) {
      memo[field] = defaultValue;
    }
    return memo;
  }, column);
}

function processColumnFieldsChange(fields, column, oldColumn) {
  return Object.keys(fields).reduce((memo, field) => {
    const onChange = fields[field].onChange;
    if (onChange && fields[field].show) {
      return onChange(memo, oldColumn);
    }
    return memo;
  }, column);
}
/*
function getInvalidReason(fields) {
  return Object.keys(fields).reduce((memo, field) => {
    const reason = fields[field].show ? fields[field].invalidReason : null;
    return memo || reason;
  }, false);
}
*/

function deleteHiddenFields(fields, column) {
  return Object.keys(fields).reduce((result, field) => {
    if (!fields[field].show) {
      delete result[field];
    }
    return result;
  }, column);
}

export default function makeColumnDefinition(column) {
  const fields = prepareFields(column);
  return {
    column: column,
    fields: fields,
    // getInvalidReason: () => getInvalidReason(fields),
    updateColumn: (property, value) => {
      let updatedColumn = {...column, [property]: value};
      const newFields = prepareFields(updatedColumn);
      updatedColumn = processColumnFieldsChange(newFields, updatedColumn, column);
      updatedColumn = deleteHiddenFields(newFields, updatedColumn);
      return makeColumnDefinition(updatedColumn);
    },
    initColumn: () => makeColumnWithDefaults(fields, column)
  };
}
