import React, {PropTypes} from 'react';
import InlineEditArea  from '../../../../../react/common/InlineEditArea'
import MetadataEditField from '../MetadataEditField';

export default React.createClass({
  displayName: 'TableDescription',

  propTypes: {
    tableId: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      placeholder: 'Describe this table'
    }
  },

  render() {
    return <MetadataEditField
      objectType="table"
      objectId={this.props.tableId}
      fieldName="description"
      editElement=InlineEditArea
      placeholder={this.props.placeholder}
    />
  }
})
