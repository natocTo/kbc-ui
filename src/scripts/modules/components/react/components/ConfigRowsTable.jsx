import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ConfigRowItem from './ConfigRowsTableItem';
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
    configRowItemElement: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      headers: ['Name'],
      configRowItemElement: ConfigRowItem
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

  renderRowActionButtons(row) {
    return (
      <span className="td text-right kbc-no-wrap">
        <DeleteConfigRowButton
          isPending={false}
          onClick={function() {}}
        />
        <ActivateDeactivateButton
          activateTooltip="Enable"
          deactivateTooltip="Disable"
          isActive={!row.get('disabled', false)}
          isPending={false}
          onChange={function() {}}
        />
      </span>
    );
  },

  render() {
    const children = this.props.rows.map(function(row) {
      const props = {
        row: row,
        componentId: this.props.componentId,
        configId: this.props.configId,
        key: row.get('id'),
        children: this.renderRowActionButtons(row)
      };
      return React.createElement(this.props.configRowItemElement, props);
    }, this).toArray();

    return (
      <div className="table table-striped table-hover">
        <div className="thead" key="table-header">
          <div className="tr">
            {this.renderHeaders()}
          </div>
        </div>
        <div className="tbody">
          {children}
        </div>
      </div>
    );
  }
});
