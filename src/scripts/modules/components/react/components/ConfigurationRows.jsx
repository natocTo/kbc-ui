import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import fuzzy from 'fuzzy';
import SearchRow from '../../../../react/common/SearchRow';
import Immutable from 'immutable';
import ConfigurationRowsTable from './ConfigurationRowsTable';

export default React.createClass({
  displayName: 'ConfigurationRows',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configurationId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    header: React.PropTypes.array,
    columns: React.PropTypes.array,
    filter: React.PropTypes.func,
    rowDelete: React.PropTypes.func.isRequired,
    rowEnableDisable: React.PropTypes.func.isRequired,
    rowDeletePending: React.PropTypes.func.isRequired,
    rowEnableDisablePending: React.PropTypes.func.isRequired,
    rowLinkTo: React.PropTypes.string.isRequired,
    onOrder: React.PropTypes.func.isRequired,
    orderPending: React.PropTypes.bool.isRequired,
    isCompletedFn: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      header: ['Name', 'Description'],
      columns: [
        function(row) {
          return row.get('name') !== '' ? row.get('name') : 'Untitled';
        },
        function(row) {
          return (
            <small>
              {row.get('description') !== '' ? row.get('description') : 'No description'}
            </small>
          );
        }
      ],
      filter: function(row, query) {
        return fuzzy.test(query, row.get('name')) || fuzzy.test(query, row.get('description'));
      }
    };
  },

  getInitialState() {
    return {
      query: '',
      rows: Immutable.OrderedSet()
    };
  },

  componentWillReceiveProps(nextProps) {
    const state = this.state;
    this.setState({
      rows: nextProps.rows
        .filter(function(row) {
          return nextProps.filter(row, state.query);
        })
    });
  },

  onChangeSearch(query) {
    this.setState({
      query: query,
      rows: this.props.rows.filter(function(row) {
        return this.props.filter(row, query);
      }, this)
    });
  },

  onOrder(oldIndex, newIndex) {
    const draggedRow = this.props.rows.get(oldIndex);
    const newOrder = this.props.rows.splice(oldIndex, 1).splice(newIndex, 0, draggedRow).toOrderedSet();
    this.setState({
      rows: newOrder
    });
    const newOrderIds = newOrder.map(function(row) {
      return row.get('id');
    }).toJS();
    return this.props.onOrder(newOrderIds);
  },

  renderTable() {
    const props = this.props;
    const state = this.state;
    if (this.state.rows.size === 0) {
      return (
        <div>No result found.</div>
      );
    } else {
      return (
        <ConfigurationRowsTable
          columns={props.columns}
          header={props.header}
          componentId={props.componentId}
          configurationId={props.configurationId}
          rowLinkTo={props.rowLinkTo}
          rowDeletePending={props.rowDeletePending}
          rowDelete={props.rowDelete}
          rowEnableDisablePending={props.rowEnableDisablePending}
          rowEnableDisable={props.rowEnableDisable}
          disabledMove={state.query !== ''}
          isCompletedFn={props.isCompletedFn}
          onOrder={this.onOrder}
          rows={this.state.rows}
        />
      );
    }
  },

  render() {
    return (
      <div>
        <div>
          <SearchRow
            query={this.state.query}
            onChange={this.onChangeSearch}
            onSubmit={this.onChangeSearch}
          />
        </div>
        {this.renderTable()}
      </div>
    );
  }
});
