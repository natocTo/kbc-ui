import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import Row from './ConfigurationRowsTableRow';
import classnames from 'classnames';
import Sortable from 'sortablejs';

require('./ConfigurationRowsTable.less');

export default React.createClass({
  displayName: 'ConfigurationRowsTable',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configurationId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    header: React.PropTypes.array,
    columns: React.PropTypes.array,
    rowDelete: React.PropTypes.func.isRequired,
    rowEnableDisable: React.PropTypes.func.isRequired,
    rowDeletePending: React.PropTypes.func.isRequired,
    rowEnableDisablePending: React.PropTypes.func.isRequired,
    rowLinkTo: React.PropTypes.string.isRequired,
    onOrder: React.PropTypes.func.isRequired,
    orderPending: React.PropTypes.bool.isRequired,
    isCompletedFn: React.PropTypes.func.isRequired,
    disabledMove: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      dragging: false
    };
  },

  componentDidMount() {
    const component = this;
    const sortableOptions = {
      disabled: this.props.disabledMove || this.props.orderPending,
      handle: '.drag-handle',
      forceFallback: true,
      animation: 100,
      onStart: function() {
        component.setState({dragging: true});
      },
      onEnd: function(e) {
        component.setState({dragging: false});
        component.props.onOrder(e.oldIndex, e.newIndex);
      }
    };
    Sortable.create(this.refs.list, sortableOptions);
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
    return this.props.rows.map(function(row, rowIndex) {
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
          disabledMove={props.disabledMove}
          disabledRun={!props.isCompletedFn(row.get('configuration'))}
          orderPending={props.orderPending}
        />
      );
    });
  },

  render() {
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
        <div className="tbody" ref="list">
          {this.renderTableRows()}
        </div>
      </div>
    );
  }
});
