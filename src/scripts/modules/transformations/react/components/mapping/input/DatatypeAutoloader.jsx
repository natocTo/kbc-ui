import React from 'react';
import MetadataStore from '../../../../../components/stores/MetadataStore';
import createStoreMixin from '../../../../../../react/mixins/createStoreMixin';

export default React.createClass({
  propTypes: {
    tableId: React.PropTypes.string.isRequired,
    columns: React.PropTypes.array.isRequired,
    disabled: React.PropTypes.bool,
    handleAutoloadDataTypes: React.PropTypes.func.isRequired
  },

  mixins: [createStoreMixin(MetadataStore)],

  getStateFromStores: function() {
    return {
      hasMetadataDatatypes: MetadataStore.tableHasMetadataDatatypes(this.props.tableId),
      tableColumnMetadata: MetadataStore.getTableColumnsMetadata(this.props.tableId)
    };
  },

  handleAutoload: function() {
    this.state.tableColumnMetadata.map((metadata, colname) => {
      this.props.handleAutoloadDataTypes(colname, metadata);
    });
  },

  render() {
    if (!this.props.disabled && this.state.hasMetadataDatatypes) {
      return (
        <span>
          <button onClick={this.handleAutoload}>Autoload Datatypes</button>
        </span>
      );
    } else {
      return null;
    }
  }
});
