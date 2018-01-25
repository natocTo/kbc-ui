import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import DeleteConfigurationRowButton from './DeleteConfigurationRowButton';
import RunComponentButton from './RunComponentButton';
import { Link } from 'react-router';
import { Loader } from '@keboola/indigo-ui';


const TableRow = React.createClass({
  displayName: 'ConfigurationRowsTableRow',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configurationId: React.PropTypes.string.isRequired,
    row: React.PropTypes.object.isRequired,
    rowNumber: React.PropTypes.number.isRequired,
    columns: React.PropTypes.array.isRequired,
    linkTo: React.PropTypes.string.isRequired,
    isDeletePending: React.PropTypes.bool.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    isEnableDisablePending: React.PropTypes.bool.isRequired,
    onEnableDisable: React.PropTypes.func.isRequired,
    disabledMove: React.PropTypes.bool.isRequired,
    disabledRun: React.PropTypes.bool.isRequired,
    orderPending: React.PropTypes.bool.isRequired
  },

  renderDragHandle() {
    if (this.props.orderPending) {
      return (<Loader className="fa-fw" style={{cursor: 'not-allowed'}} />);
    }
    if (this.props.disabledMove) {
      return (<span className="fa fa-bars fa-fw" style={{cursor: 'not-allowed'}} />);
    }
    return ((<span className="fa fa-bars fa-fw drag-handle" style={{cursor: 'move'}} />));
  },

  render() {
    const props = this.props;
    return (
      <Link
        to={this.props.linkTo}
        params={{config: this.props.configurationId, row: this.props.row.get('id')}}
        className="tr"
        data-id={props.row.get('id')}
      >
        <div className="td" key="handle">
          {this.renderDragHandle()}
        </div>
        <div className="td" key="row-number">
          {this.props.rowNumber}
        </div>
        {this.props.columns.map(function(columnFunction, columnIndex) {
          return (
            <div className="td kbc-break-all" key={columnIndex}>
              {columnFunction(props.row)}
            </div>
          );
        })}
        <div className="td text-right kbc-no-wrap">
          {this.renderRowActionButtons()}
        </div>
      </Link>
    );
  },

  renderRowActionButtons() {
    const props = this.props;
    return [
      (<DeleteConfigurationRowButton
        key="delete"
        isPending={this.props.isDeletePending}
        onClick={this.props.onDelete}
      />),
      (<ActivateDeactivateButton
        key="activate"
        activateTooltip="Enable"
        deactivateTooltip="Disable"
        isActive={!this.props.row.get('isDisabled', false)}
        isPending={this.props.isEnableDisablePending}
        onChange={this.props.onEnableDisable}
      />),
      (<RunComponentButton
        key="run"
        title="Run"
        component={this.props.componentId}
        runParams={function() {
          return {
            config: props.configurationId,
            row: props.row.get('id')
          };
        }}
        disabled={this.props.disabledRun}
      >
          {this.renderRunModalContent()}
        </RunComponentButton>
      )
    ];
  },

  renderRunModalContent() {
    const rowName = this.props.row.get('name', 'Untitled');
    if (this.props.row.get('isDisabled')) {
      return 'You are about to run ' + rowName + '. Configuration ' + rowName + ' is disabled and will be forced to run ';
    } else {
      return 'You are about to run ' + rowName + '.';
    }
  }
});

export default TableRow;
