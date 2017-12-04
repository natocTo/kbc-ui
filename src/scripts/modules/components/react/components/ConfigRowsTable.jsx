import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import DeleteConfigRowButton from './DeleteConfigRowButton';

export default React.createClass({
  displayName: 'ConfigRowsTable',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    headers: React.PropTypes.array,
    columns: React.PropTypes.array
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
        <div className="tr" key={rowIndex}>
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
        </div>
      );
    }, this);
  },

  renderRowActionButtons(row) {
    return [
      (<DeleteConfigRowButton
        key="delete"
        isPending={false}
        onClick={function() {}}
      />),
      (<ActivateDeactivateButton
        key="activate"
        activateTooltip="Enable"
        deactivateTooltip="Disable"
        isActive={!row.get('disabled', false)}
        isPending={false}
        onChange={function() {}}
      />)
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
