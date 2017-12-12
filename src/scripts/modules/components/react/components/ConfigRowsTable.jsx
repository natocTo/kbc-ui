import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import DeleteConfigRowButton from './DeleteConfigRowButton';
import RunComponentButton from './RunComponentButton';
import {Link} from 'react-router';

export default React.createClass({
  displayName: 'ConfigRowsTable',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    headers: React.PropTypes.array,
    columns: React.PropTypes.array,
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
      ]
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

  renderRows() {
    return this.props.rows.map(function(row, rowIndex) {
      return (
        <Link to={this.props.rowLinkTo} params={{config: this.props.configId, row: row.get('id')}} className="tr" key={rowIndex}>
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
      (<DeleteConfigRowButton
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
          You are about to run row {row.get('name') !== '' ? row.get('name') : 'Untitled'}.
          {row.get('disabled') === true ? ' This row is disabled and will be forced to run.' : null}
        </RunComponentButton>
      )
    ];
  },

  render() {
    return (
      <div className="table table-striped table-hover">
        <div className="thead" key="table-header">
          <div className="tr">
            {this.renderHeaders()}
          </div>
        </div>
        <div className="tbody">
          {this.renderRows()}
        </div>
      </div>
    );
  }
});