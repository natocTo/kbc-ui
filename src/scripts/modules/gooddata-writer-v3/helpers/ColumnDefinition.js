import keyMirror from 'fbjs/lib/keyMirror';

export const Types = keyMirror({
  ATTRIBUTE: null,
  IGNORE: null,
  CONNECTION_POINT: null,
  DATE: null,
  FACT: null,
  HYPERLINK: null,
  LABEL: null,
  REFERENCE: null
});

export const DataTypes = keyMirror({
  BIGINT: null,
  DATE: null,
  DECIMAL: null,
  INT: null,
  VARCHAR: null
});

const BASE_TYPES = [
  Types.CONNECTION_POINT,
  Types.ATTRIBUTE,
  Types.FACT
];

// export const mustHave;

function checkEmpty(value, label) {
  return !value && ((label || 'Value') + ' can not be empty');
}

/* function checkValueOf(values) {
 *   return (value) => !values.includes(value) && 'invalid value ' + value;
 * } */

function prepareFields(column) {
  const {type, dataType} = column;
  return {
    type: {
      show: true,
      invalidReason: checkEmpty(column.type, 'Type')
    },
    title: {
      show: BASE_TYPES.includes(type),
      invalidReason: checkEmpty(column.title, 'GoodData Title')
    },

    dataType: {
      show: BASE_TYPES.includes(type)
    },

    dataTypeSize: {
      show: BASE_TYPES.includes(type) && [DataTypes.VARCHAR, DataTypes.DECIMAL].includes(dataType),
      invalidReason: (dataType === DataTypes.VARCHAR) ?
                     isNaN(column.dataSize) && ('Invalid data size value ' + column.dataSize) :
                     !/^\d+,\d+$/.test(column.dataSize) && 'Ivalid decimal format' + column.dataSize
    },
    reference: {
      show: [Types.HYPERLINK, Types.LABEL].includes(type),
      invalidReason: checkEmpty(column.reference, 'Reference')
    },
    schemaReference: {
      show: type === Types.REFERENCE
    },
    sortLabel: {
      show: type === Types.ATTRIBUTE
    },
    sortOrder: {
      show: type === Types.ATTRIBUTE
    },
    format: {
      show: type === Types.DATE,
      invalidReason: checkEmpty(column.format, 'Reference')

    },
    dateDimension: {
      show: type === Types.DATE,
      invalidReason: checkEmpty(column.dateDimension, 'Date dimension')
    },
    identifier: {
      show: BASE_TYPES.includes(type)
    },
    identifierLabel: {
      show: type === Types.ATTRIBUTE
    },
    identifierSortLabel: {
      show: type === Types.ATTRIBUTE
    }
  };
}

function getInvalidReason(fields) {
  return Object.keys(fields).reduce((memo, field) => {
    const reason = fields[field].show ? fields[field].invalidReason : null;
    return memo || reason;
  }, false);
}


function filterHiddenFields(fields, column) {
  return Object.keys(fields).reduce((result, field) => {
    if (fields[field].show) {
      result[field] = column[field];
    }
    return result;
  }, {});
}


export default function makeColumnDefinition(column) {
  const fields = prepareFields(column);
  return {
    column: column,
    fields: fields,
    invalidReason: getInvalidReason(fields),
    updateColumn: (property, value) => {
      const updatedColumn = {...column, [property]: value};
      const newFields = prepareFields(column);
      const newColumn = filterHiddenFields(newFields, updatedColumn);
      return makeColumnDefinition(newColumn);
    }
  };
}
