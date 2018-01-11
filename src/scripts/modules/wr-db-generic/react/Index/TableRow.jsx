import React from 'react';

import {Button} from 'react-bootstrap';

import {Check, Loader} from 'kbc-react-components';
import {ActivateDeactivateButton, Confirm, Tooltip} from '../../../../react/common/common';

import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';

import SapiTableLinkEx from '../../../components/react/components/StorageApiTableLinkEx';

export default React.createClass({

  mixins: [ImmutableRenderMixin],

  propTypes: {
    tableExists: React.PropTypes.bool.isRequired,
    isTableExported: React.PropTypes.bool.isRequired,
    isIncremental: React.PropTypes.bool,
    tableDbName: React.PropTypes.string,
    table: React.PropTypes.object.isRequired,
    isDeleting: React.PropTypes.bool.isRequired
  },

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
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
            isActive={false}
            isPending={false}
            onChange={() => false}
          />
        </div>
      </div>
    );
  },

  renderDeleteButton() {
    const tableId = this.props.table.get('id');

    if (this.props.isDeleting) {
      return (
        <div className="btn btn-link">
          <Loader />
        </div>
      );
    } else {
      return (
        <Confirm
          key={tableId}
          title={'Remove ' + tableId}
          text="You are about to remove the table from the configuration."
          buttonLabel="Remove"
          onConfirm={() => false}
        >
          <Tooltip
            tooltip="Remove table from configuration"
            placement="top"
          >
            <Button bsStyle="link"><i className="kbc-icon-cup" /></Button>
          </Tooltip>
        </Confirm>
      );
    }
  }

});

