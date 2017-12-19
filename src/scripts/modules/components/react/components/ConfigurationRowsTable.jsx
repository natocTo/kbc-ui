import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import DeleteConfigurationRowButton from './DeleteConfigurationRowButton';
import RunComponentButton from './RunComponentButton';
import {Link} from 'react-router';
import fuzzy from 'fuzzy';
import SearchRow from '../../../../react/common/SearchRow';

export default React.createClass({
  displayName: 'ConfigurationRowsTable',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configId: React.PropTypes.string.isRequired,
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
    return rows.map(function(row, rowIndex) {
      return (
        <Link to={this.props.rowLinkTo} params={{config: this.props.configId, row: row.get('id')}} className="tr"
              key={rowIndex}>
          {this.props.columns.map(function(columnFunction, columnIndex) {
            return (
              <div className="td kbc-break-all" key={columnIndex}>
                {columnFunction(row)}
              </div>
            );
          })}
          <div className="td text-right kbc-no-wrap">
            {this.renderRowActionButtons(row)}
          </div>
        </Link>
      );
    }, this);
  },

  renderRowActionButtons(row) {
    const props = this.props;
    return [
      (<DeleteConfigurationRowButton
        key="delete"
        isPending={this.props.rowDeletePending(row.get('id'))}
        onClick={function() {
          return props.rowDelete(row.get('id'));
        }}
      />),
      (<ActivateDeactivateButton
        key="activate"
        activateTooltip="Enable"
        deactivateTooltip="Disable"
        isActive={!row.get('isDisabled', false)}
        isPending={this.props.rowEnableDisablePending(row.get('id'))}
        onChange={function() {
          return props.rowEnableDisable(row.get('id'));
        }}
      />),
      (<RunComponentButton
        key="run"
        title="Run"
        component={this.props.componentId}
        runParams={function() {
          return {
            config: props.configId,
            row: row.get('id')
          };
        }}
      >
          {this.renderRunModalContent(row)}
        </RunComponentButton>
      )
    ];
  },

  renderRunModalContent(row) {
    const rowName = row.get('name', 'Untitled');
    if (row.get('isDisabled')) {
      return 'You are about to run ' + rowName + '. Configuration ' + rowName + ' is disabled and will be forced to run ';
    } else {
      return 'You are about to run ' + rowName + '.';
    }
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
