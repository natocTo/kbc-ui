import keyMirror from 'fbjs/lib/keyMirror';
import {List, Map, fromJS} from 'immutable';

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
      invalidReason: checkEmpty(column.type, 'Type'),
      defaultValue: 'IGNORE'
    },
    title: {
      show: BASE_TYPES.includes(type),
      invalidReason: checkEmpty(column.title, 'GoodData Title'),
      defaultValue: column.id
    },

    dataType: {
      show: BASE_TYPES.includes(type)
    },

    dataTypeSize: {
      show: BASE_TYPES.includes(type) && [DataTypes.VARCHAR, DataTypes.DECIMAL].includes(dataType),
      invalidReason: (dataType === DataTypes.VARCHAR) ?
                     isNaN(column.dataSize) && ('Invalid data size value ' + column.dataSize) :
                     !/^\d+,\d+$/.test(column.dataSize) && 'Ivalid decimal format' + column.dataSize,
      defaultValue: column.dataType === DataTypes.VARCHAR ? '255' : '12,2',
      onChange: (newColumn, oldColumn) => {
        if (newColumn.dataType !== oldColumn.dataType) {
          switch (newColumn.dataType) {
            case DataTypes.VARCHAR:
              newColumn.dataTypeSize = '255';
              break;
            case DataTypes.DECIMAL:
              newColumn.dataTypeSize = '12,2';
              break;
            default:
              break;
          }
        }
        return newColumn;
      }
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
      show: type === Types.ATTRIBUTE && column.sortLabel,
      defaultValue: 'ASC'
    },
    format: {
      show: type === Types.DATE,
      invalidReason: checkEmpty(column.format, 'Date format'),
      defaultValue: 'yyyy-MM-dd HH:mm:ss'
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

function getInvalidReason(fields) {
  return Object.keys(fields).reduce((memo, field) => {
    const reason = fields[field].show ? fields[field].invalidReason : null;
    return memo || reason;
  }, false);
}


function deleteHiddenFields(fields, column) {
  return Object.keys(fields).reduce((result, field) => {
    if (!fields[field].show) {
      delete result[field];
    }
    return result;
  }, column);
}

export function initHeaderState(columns) {
  const showIdentifiers = columns.find(column => {
    return !!(column.identifier ||
           column.identifierLabel ||
           column.identifierSortLabel);
  });
  return {showIdentifiers};
}

const REFERENCABLE_COLUMN_TYPES = [Types.CONNECTION_POINT, Types.ATTRIBUTE];

export function prepareColumnContext(table, sectionContext, allColumns) {
  const configRows = sectionContext.getIn(['rawConfiguration', 'rows'], List());
  const tableId = table.get('id');
  const dimensionsPath = ['rawConfiguration', 'configuration', 'parameters', 'dimensions'];
  const tablesPath = ['configuration', 'parameters', 'tables'];

  const referencableTables = configRows.reduce((result, configRow) => {
    const configRowTables =  configRow.getIn(tablesPath);
    // ignore current table config row
    if (configRowTables.has(tableId)) {
      return result;
    }
    const rowColumns = configRowTables.first().get('columns', Map());
    const matchColumn = rowColumns.find(column => column.get('type') === Types.CONNECTION_POINT);
    const rowTableId = configRowTables.keySeq().first();
    if (matchColumn) {
      return result.push(rowTableId);
    }
    return result;
  }, List());
  const referencableColumns = allColumns
    .filter(column => REFERENCABLE_COLUMN_TYPES.includes(column.get('type')))
    .map(column => column.get('id'));
  const sortLabelsColumns = allColumns.reduce((memo, column) => {
    if (!column.get('reference')) return memo;
    return memo.update(column.get('reference'), List(), labels => labels.push(column.get('id')));
  }, Map());

  const dimensions = sectionContext.getIn(dimensionsPath, Map()).keySeq().toList();
  return fromJS({referencableTables, referencableColumns, sortLabelsColumns, dimensions});
}

export default function makeColumnDefinition(column) {
  const fields = prepareFields(column);
  return {
    column: column,
    fields: fields,
    getInvalidReason: () => getInvalidReason(fields),
    updateColumn: (property, value) => {
      let updatedColumn = {...column, [property]: value};
      if (property === 'dataType') {
        delete updatedColumn.dataTypeSize;
      }
      const newFields = prepareFields(updatedColumn);
      updatedColumn = processColumnFieldsChange(newFields, updatedColumn, column);
      updatedColumn = deleteHiddenFields(newFields, updatedColumn);
      return makeColumnDefinition(updatedColumn);
    },
    initColumn: () => makeColumnWithDefaults(fields, column)
  };
}
