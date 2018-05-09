import React from 'react';
import MetadataStore from '../../../../../components/stores/MetadataStore';
import createStoreMixin from '../../../../../../react/mixins/createStoreMixin';

export default React.createClass({
  displayName: 'DataTypeAutoloader',
  propTypes: {
    tableId: React.PropTypes.string.isRequired,
    columns: React.PropTypes.array.isRequired,
    disabled: React.PropTypes.bool,
    handleAutoloadDataTypes: React.PropTypes.func.isRequired
  },

  mixins: [createStoreMixin(MetadataStore)],

  render() {
    if (!this.state.disabled && MetadataStore.tableHasMetadataDatatypes(this.props.tableId)) {
      return (
        <span>
          <button onClick={this.handleAutoloadDataTypes}>Autoload Datatypes</button>
        </span>
      );
    } else {
      return null;
    }
  }
});
