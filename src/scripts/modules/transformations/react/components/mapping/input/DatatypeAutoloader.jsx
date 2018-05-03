import React from 'react';
import {MetadataStore} from '../../../../../components/stores/MetadataStore';

export default React.createClass({
  displayName: 'DataTypeAutoloader',
  propTypes: {
    tableId: React.PropTypes.string.isRequired,
    columns: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    onAutoloadDatatypes: React.PropTypes.func.isRequired
  },


  hasMetadataDatatypes() {
    const lastUpdateInfo = MetadataStore.getTableLastUpdatedInfo(this.props.tableId);
    const columnsWithBaseTypes = this.props.columns.filter((column) => {
      MetadataStore.hasProviderMetadata(
        'column',
        column,
        lastUpdateInfo.component,
        'KBC.datatype.baseType'
      );
    });
    return !!columnsWithBaseTypes;
  },

  render() {
    if (!this.props.disabled && this.hasMetadataDatatypes()) {
      return (
        <span>
          <button onClick={this.prepareDataTypes}>Autoload Datatypes</button>
        </span>
      );
    } else {
      return null;
    }
  }
});
