import React from 'react';
import Immutable from 'immutable';
import DatatypeFormRow from './DatatypeFormRow';
import MetadataStore from '../../../../../components/stores/MetadataStore';
import createStoreMixin from '../../../../../../react/mixins/createStoreMixin';

export default React.createClass({
  propTypes: {
    tableId: React.PropTypes.string.isRequired,
    columns: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  mixins: [createStoreMixin(MetadataStore)],

  getStateFromStores: function() {
    return {
      hasMetadataDatatypes: MetadataStore.tableHasMetadataDatatypes(this.props.tableId),
      tableColumnMetadata: MetadataStore.getTableColumnsMetadata(this.props.tableId)
    };
  },

  _datatypesMap: new Immutable.Map({
    NUMBER: {
      name: 'NUMBER',
      basetype: 'NUMERIC',
      size: true
    },
    INTEGER: {
      name: 'INTEGER',
      basetype: 'INTEGER',
      size: true
    },
    FLOAT: {
      name: 'FLOAT',
      basetype: 'FLOAT',
      size: false
    },
    VARCHAR: {
      name: 'VARCHAR',
      basetype: 'STRING',
      size: true
    },
    DATE: {
      name: 'DATE',
      basetype: 'DATE',
      size: false
    },
    TIMESTAMP: {
      name: 'TIMESTAMP',
      basetype: 'TIMESTAMP',
      size: false
    },
    TIMESTAMP_LTZ: {
      name: 'TIMESTAMP_LTZ',
      size: false
    },
    TIMESTAMP_NTZ: {
      name: 'TIMESTAMP_NTZ',
      size: false
    },
    TIMESTAMP_TZ: {
      name: 'TIMESTAMP_TZ',
      size: false
    },
    VARIANT: {
      name: 'VARIANT',
      size: false
    }
  }),


  getDataTypes: function(columnMetadata) {
    const datatypesMap = Immutable.fromJS(this._datatypesMap);
    const datatypes = columnMetadata.map((metadata, colname) => {
      let datatypeLength = metadata.filter((entry) => {
        return entry.get('key') === 'KBC.datatype.length';
      });
      if (datatypeLength.count() > 0) {
        datatypeLength = datatypeLength.get(0);
      }
      let datatypeNullable = metadata.filter((entry) => {
        return entry.get('key') === 'KBC.datatype.nullable';
      });
      if (datatypeNullable.count() > 0) {
        datatypeNullable = datatypeNullable.get(0);
      }
      let basetype = metadata.filter((entry) => {
        return entry.get('key') === 'KBC.datatype.basetype';
      });

      if (basetype.count() === 0) {
        return null;
      } else {
        basetype = basetype.get(0);
      }
      let datatypeName = null;

      let datatype = datatypesMap.map((mappedDatatype) => {
        if (mappedDatatype.get('basetype') === basetype.get('value')) {
          datatypeName = datatype.get('name');
          return mappedDatatype;
        }
      });

      return Immutable.fromJS({
        column: colname,
        type: datatypeName,
        length: datatype.get(datatypeName).get('size') ? datatypeLength.get('value') : null,
        convertEmptyValuesToNull: datatypeNullable.get('value')
      });
    });
    return this.props.onChange(datatypes);
  },

  getDefaultDatatypes: function() {
    if (this.state.hasMetadataDatatypes) {
      const metadataSet = this.state.tableColumnMetadata.filter((metadata, colname) => {
        return this.props.columns.indexOf(colname) > -1;
      });
      return this.getDefaultDataTypes(metadataSet);
    } else {
      return this.props.columns.map((column) => {
        // TODO: check for PK column
        return Immutable.fromJS({
          column: column,
          type: 'VARCHAR',
          length: null,
          convertEmptyValuesToNull: false
        });
      });
    }
  },

  renderColumn: function(column) {
    const types = this.getDefaultDatatypes();
    const columnObject = types.filter((type) => {
      return type.column === column;
    });
    return (
      <DatatypeFormRow
        column={columnObject}
        onChange={this.hangleColumnChange}
        disabled={this.props.disabled}
      />
    );
  },

  render: function() {
    const renderedColumns = this.getColumns.map((column) => {
      return this.renderColumn(column);
    });
    return ({renderedColumns});
  }
});
