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

function checkEmpty(value) {
  return !value && 'can not be empty';
}

function checkValueOf(values) {
  return (value) => !values.includes(value) && 'invalid value ' + value;
}

function composeValidation(...validationFns) {
  return (value) =>
    validationFns.reduce((memo, nextValidationFn) =>
      memo ? memo : nextValidationFn(value)
    );
}

export function makeDefinition(column) {
  const {type, dataType} = column.type;
  return {
    type: {
      show: true,
      invalidReason: checkValueOf(Types.keys())
    },
    title: {
      show: BASE_TYPES.includes(type),
      invalidReason: checkEmpty
    },

    dataType: {
      show: BASE_TYPES.includes(type),
      invalidReason: composeValidation(checkEmpty, checkValueOf(DataTypes.keys()))
    },

    dataSize: {
      show: [DataTypes.VARCHAR, DataTypes.DECIMAL].includes(dataType),
      invalidReason: (value) => {
        if (dataType === DataTypes.VARCHAR) {
          return isNaN(value) && 'Invalid value ' + value;
        }
      }
    },
    reference: {
      show: [Types.HYPERLINK, Types.LABEL].includes(type)
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
      show: type === Types.DATE
    },
    dateDimension: {
      show: type === Types.DATE
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
