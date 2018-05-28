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
    if (this.props.tableId) {
      return {
        hasMetadataDatatypes: MetadataStore.tableHasMetadataDatatypes(this.props.tableId),
        tableColumnMetadata: MetadataStore.getTableColumnsMetadata(this.props.tableId)
      };
    }
    return null;
  },

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
    const metadataSet = this.state.tableColumnMetadata.filter((metadata, colname) => {
      return this.props.columns.indexOf(colname) > -1;
    });
    return this.getDefaultDataTypes(metadataSet);
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
