import React from 'react';

import {Button} from 'react-bootstrap';

import {Check, Loader} from 'kbc-react-components';
import {ActivateDeactivateButton, Tooltip} from '../../../../react/common/common';

import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';

import SapiTableLinkEx from '../../../components/react/components/StorageApiTableLinkEx';

export default React.createClass({
  displayName: 'TableRow',
  mixins: [ImmutableRenderMixin],
  propTypes: {
    tableExists: React.PropTypes.bool.isRequired,
    isTableExported: React.PropTypes.bool.isRequired,
    isIncremental: React.PropTypes.bool,
    tableDbName: React.PropTypes.string,
    table: React.PropTypes.object.isRequired,
    isDeleting: React.PropTypes.bool.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    isSaving: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div className="tr">
        <div className="td">
          <SapiTableLinkEx
            tableId={this.props.table.get('id')}
          >{this.props.table.get('name')}</SapiTableLinkEx>
        </div>
        <div className="td">
          {this.props.tableDbName}
        </div>
        <div className="td">
          <Check isChecked={this.props.isIncremental}/>
        </div>
        <div className="td text-right">
          {this.renderDeleteButton()}
          <ActivateDeactivateButton
            activateTooltip={'Select table to upload'}
            deactivateTooltip={'Deselect table from upload'}
            isActive={this.props.isTableExported}
            isPending={this.props.isSaving}
            onChange={this.toggleTable}
          />
        </div>
      </div>
    );
  },

  toggleTable(isExported) {
    this.props.onChange(this.props.table.get('id'), isExported);
  },

  deleteTable() {
    this.props.onDelete(this.props.table.get('id'));
  },

  renderDeleteButton() {
    if (this.props.isDeleting) {
      return (
        <div className="btn btn-link">
          <Loader />
        </div>
      );
    } else {
      return (
        <Tooltip
          tooltip="Delete table"
        >
          <Button bsStyle="link" onClick={this.deleteTable}><i className="kbc-icon-cup" /></Button>
        </Tooltip>
      );
    }
  }

});

