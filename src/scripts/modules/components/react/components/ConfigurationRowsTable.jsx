import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import fuzzy from 'fuzzy';
import SearchRow from '../../../../react/common/SearchRow';
import Row from './ConfigurationRowsTableRow';

export default React.createClass({
  displayName: 'ConfigurationRowsTable',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configurationId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    headers: React.PropTypes.array,
    columns: React.PropTypes.array,
    filter: React.PropTypes.func,
    rowDelete: React.PropTypes.func.isRequired,
    rowEnableDisable: React.PropTypes.func.isRequired,
    rowDeletePending: React.PropTypes.func.isRequired,
    rowEnableDisablePending: React.PropTypes.func.isRequired,
    rowLinkTo: React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      headers: ['Name', 'Description'],
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
      query: ''
    };
  },

  renderHeaders() {
    return this.props.headers.map(function(header, index) {
      return (
        <span className="th" key={index}>
          <strong>{header}</strong>
        </span>
      );
    });
  },

  renderTableRows(rows) {
    const props = this.props;
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
          />
      );
    });
  },

  onChangeSearch(query) {
    this.setState({query: query});
  },

  onSubmitSearch(query) {
    this.setState({query: query});
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
              {this.renderHeaders()}
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
    const filteredRows = this.props.rows.filter(function(row) {
      return this.props.filter(row, this.state.query);
    }, this);

    return (
      <div>
        <div>
          <SearchRow
            query={this.state.query}
            onChange={this.onChangeSearch}
            onSubmit={this.onSubmitSearch}
          />
        </div>
        {this.renderTable(filteredRows)}
      </div>
    );
  }
});
