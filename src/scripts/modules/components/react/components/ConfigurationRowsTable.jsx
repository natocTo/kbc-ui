import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import fuzzy from 'fuzzy';
import SearchRow from '../../../../react/common/SearchRow';
import Row from './ConfigurationRowsTableRow';
import Immutable from 'immutable';
import classnames from 'classnames';

export default React.createClass({
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
      rows: Immutable.OrderedSet(),
      dragging: false
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

  renderHeader() {
    return this.props.header.map(function(headerName, index) {
      return (
        <span className="th" key={index}>
          <strong>{headerName}</strong>
        </span>
      );
    });
  },

  renderTableRows() {
    const props = this.props;
    const state = this.state;
    return this.state.rows.map(function(row, rowIndex) {
      return (
        <Row
          columns={props.columns}
          row={row}
          componentId={props.componentId}
          configurationId={props.configurationId}
          key={rowIndex}
          rowNumber={rowIndex + 1}
          linkTo={props.rowLinkTo}
          isDeletePending={props.rowDeletePending(row.get('id'))}
          onDelete={function() {
            return props.rowDelete(row.get('id'));
          }}
          isEnableDisablePending={props.rowEnableDisablePending(row.get('id'))}
          onEnableDisable={function() {
            return props.rowEnableDisable(row.get('id'));
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

  renderTable() {
    if (this.state.rows.size === 0) {
      return (
        <div>No result found.</div>
      );
    } else {
      return (
        <div className={classnames(
          'table',
          'table-striped',
          {
            'table-hover': !this.state.dragging
          }
        )}>
          <div className="thead" key="table-header">
            <div className="tr">
              <span className="th" key="dummy" />
              <span className="th" key="row-number">#</span>
              {this.renderHeader()}
            </div>
          </div>
          <div className="tbody">
            {this.renderTableRows()}
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
        {this.renderTable()}
      </div>
    );
  }
});
