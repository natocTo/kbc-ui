import React from 'react';
import _ from 'underscore';
import Immutable from 'immutable';
import DatatypeFormRow from './DatatypeFormRow';

export default React.createClass({
  propTypes: {
    datatypes: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    hasMetadataDatatypes: React.PropTypes.bool.isRequired,
    tableColumnMetadata: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  snowflakeDatatypesMap: new Immutable.fromJS({
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


  getMetadataDataTypes(columnMetadata) {
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

      let datatype = this.snowflakeDatatypesMap.map((mappedDatatype) => {
        if (mappedDatatype.get('basetype') === basetype.get('value')) {
          datatypeName = mappedDatatype.get('name');
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
    return datatypes;
  },

  getDefaultDatatypes() {
    if (this.props.hasMetadataDatatypes) {
      const metadataSet = this.props.tableColumnMetadata.filter((metadata, colname) => {
        return this.props.columns.indexOf(colname) > -1;
      });
      return this.getMetadataDataTypes(metadataSet);
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

  handleColumnChange(newType) {
    // replace the changed column
    const datatypes = this.props.datatypes.map((type) => {
      if (type.get('column') === newType.get('column')) {
        return newType;
      } else {
        return type;
      }
    });
    return this.props.onChange(datatypes);
  },

  getTypeOptions() {
    return _.map(_.keys(this.snowflakeDatatypesMap.toJS()), (option) => {
      return {
        label: option,
        value: option
      };
    });
  },

  renderColumn(column) {
    const types = this.props.datatypes.count() > 0 ? this.props.datatypes : this.getDefaultDatatypes();
    const columnObject = types.filter((type) => {
      return type.get('column') === column;
    });
    return (
      <DatatypeFormRow
        datatype={columnObject.get(column)}
        typeOptions={this.getTypeOptions()}
        onChange={this.handleColumnChange}
        disabled={this.props.disabled}
      />
    );
  },

  render() {
    if (this.props.disabled) {
      return null;
    }
    const renderedColumns = this.props.columns.map((column) => {
      return this.renderColumn(column);
    });
    return (
      <div>{renderedColumns}</div>
    );
  }
});
