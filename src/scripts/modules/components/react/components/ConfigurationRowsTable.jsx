import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import fuzzy from 'fuzzy';
import SearchRow from '../../../../react/common/SearchRow';
import Row from './ConfigurationRowsTableRow';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export default DragDropContext(HTML5Backend)(React.createClass({
  displayName: 'ConfigurationRowsTable',

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
    orderPending: React.PropTypes.bool.isRequired
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
      rows: this.props.rows
    };
  },

  componentWillReceiveProps(nextProps) {
    const state = this.state;
    this.setState({
      rows: nextProps.rows.filter(function(row) {
        return nextProps.filter(row, state.query);
      }, this)
    });
  },

  renderHeader() {
    return this.props.header.map(function(headerName, index) {
      return (
        <span className="th" key={index}>
          <strong>{headerName}</strong>
        </span>
      );
    });
  },

  renderTableRows(rows) {
    const props = this.props;
    const state = this.state;
    const component = this;
    return rows.map(function(row, rowIndex) {
      return (
        <Row
          columns={props.columns}
          row={row}
          componentId={props.componentId}
          configurationId={props.configurationId}
          key={rowIndex}
          linkTo={props.rowLinkTo}
          isDeletePending={props.rowDeletePending(row.get('id'))}
          onDelete={function() {
            return props.rowDelete(row.get('id'));
          }}
          isEnableDisablePending={props.rowEnableDisablePending(row.get('id'))}
          onEnableDisable={function() {
            return props.rowEnableDisable(row.get('id'));
          }}
          onMoveProgress={function(hoverId, draggedId) {
            const draggedRow = state.rows.find(function(findRow) {
              return findRow.get('id') === draggedId;
            });
            const draggedIndex = state.rows.findIndex(function(findRow) {
              return findRow.get('id') === draggedId;
            });
            const hoverIndex = state.rows.findIndex(function(findRow) {
              return findRow.get('id') === hoverId;
            });
            component.setState({
              rows: state.rows.splice(draggedIndex, 1).splice(hoverIndex, 0, draggedRow)
            });
          }}
          onMoveFinished={function() {
            const newRowsOrder = state.rows.map(function(mapRow) {
              return mapRow.get('id');
            });
            const currentRowsOrder = props.rows.map(function(mapRow) {
              return mapRow.get('id');
            });
            if (!newRowsOrder.equals(currentRowsOrder)) {
              return props.onOrder(newRowsOrder.toJS());
            }
            return;
          }}
          disabledMove={state.query !== '' || props.orderPending}
          />
      );
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

  renderTable(rows) {
    if (rows.size === 0) {
      return (
        <div>No result found.</div>
      );
    } else {
      return (
        <div className="table table-striped table-hover">
          <div className="thead" key="table-header">
            <div className="tr">
              <span className="th" key="dummy" />
              {this.renderHeader()}
            </div>
          </div>
          <div className="tbody">
            {this.renderTableRows(rows)}
          </div>
        </div>
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
        {this.renderTable(this.state.rows)}
      </div>
    );
  }
}));
