import React from 'react';

import duration from '../../../../../utils/duration';
import TableLinkEx from '../../../../components/react/components/StorageApiTableLinkEx';
import {PanelWithDetails} from '@keboola/indigo-ui';

const limit = 10;

export default React.createClass({

  propTypes: {
    tables: React.PropTypes.object.isRequired,
    allTablesIds: React.PropTypes.object.isRequired
  },

  duration(durationSeconds) {
    return duration(Math.round(durationSeconds));
  },

  renderSlicedItems(start, count) {
    return this.props.tables
               .get('tables')
               .toSeq()
               .slice(start, count)
               .map(this.renderListItem)
               .toArray();
  },

  renderListItem(table) {
    return (
      <li key={table.get('id')}>
        <TableLinkEx
          moreTables={this.props.allTablesIds}
          tableId={table.get('id')}>
          {table.get('id')}
          <span className="text-muted">
            {' ' + this.duration(table.get('durationTotalSeconds'))}
          </span>
        </TableLinkEx>
      </li>
    );
  },

  renderWithPanel() {
    const tablesCount = this.props.tables.get('tables').count();
    const headerRows = this.renderSlicedItems(0, limit);
    const panelContentRows = this.renderSlicedItems(limit, tablesCount);
    const labelOpen = tablesCount === 100 ? `More than ${tablesCount - limit} others.` : `${tablesCount - limit} others`;
    return (
      <span>
        <ul className="list-no-bottom-margin">
          {headerRows}
        </ul>
        <PanelWithDetails
          placement="bottom"
          labelOpen={labelOpen}
          labelCollapse="Show less">
          <ul>
            {panelContentRows}
          </ul>
        </PanelWithDetails>
      </span>
    );
  },

  rows() {
    const tablesCount = this.props.tables.get('tables').count();
    if (tablesCount > limit) {
      return this.renderWithPanel();
    } else {
      return (
        <ul>
          {this.renderSlicedItems(0, tablesCount)}
        </ul>
      );
    }
  },

  render() {
    const tablesCount = this.props.tables.get('tables').count();
    if (tablesCount > 0) {
      return this.rows();
    } else {
      return (
        <div className="text-muted">No tables.</div>
      );
    }
  }
});
