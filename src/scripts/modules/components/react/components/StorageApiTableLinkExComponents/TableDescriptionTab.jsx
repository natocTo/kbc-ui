import React, {PropTypes} from 'react';

import EmptyState from '../../../../components/react/components/ComponentEmptyState';
import Markdown from '../../../../../react/common/Markdown';
import TableDescriptionEditor from './TableDescriptionEditor';

export default React.createClass({

  propTypes: {
    isLoading: PropTypes.bool,
    table: PropTypes.object,
    tableExists: PropTypes.bool.isRequired
  },

  render() {
    if (!this.props.tableExists) {
      let msg = 'Table does not exist yet.';
      if (this.props.isLoading) {
        msg = 'Loading...';
      }
      return (
        <EmptyState key="emptytable">
          {msg}
        </EmptyState>
      );
    }
    const table = this.props.table;
    const tableDesc = table.get('metadata').filter(function(metadata) {
      return metadata.get('key') === 'KBC.description' && metadata.get('provider') === 'kbc-ui';
    }).first().get('value');
    return (
      <div>
        <TableDescriptionEditor tableId={table.id}/>
        <Markdown source={tableDesc}/>
      </div>
    );
  }
});
