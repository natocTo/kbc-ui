import React from 'react';
import {Modal} from 'react-bootstrap';
import SapiTableSelector from '../../modules/components/react/components/SapiTableSelector';

import ConfirmButtons from './ConfirmButtons';


export default React.createClass({

  propTypes: {
    show: React.PropTypes.bool,
    onHideFn: React.PropTypes.func,
    selectedTableId: React.PropTypes.string,
    onSetTableIdFn: React.PropTypes.func,
    configuredTables: React.PropTypes.object,
    onSaveFn: React.PropTypes.func,
    isSaving: React.PropTypes.bool,
    allowedBuckets: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      allowedBuckets: ['in', 'out']
    };
  },

  render() {
    return (
      <Modal
        onHide={this.props.onHideFn}
        show={this.props.show}>
        <Modal.Header closeButton>
          <Modal.Title> New Table </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SapiTableSelector
            allowedBuckets={this.props.allowedBuckets}
            onSelectTableFn={this.props.onSetTableIdFn}
            excludeTableFn={ (tableId) => !!this.props.configuredTables.get(tableId)}
            value={this.props.selectedTableId}
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.isSaving}
            isDisabled={!this.props.selectedTableId}
            cancelLabel="Cancel"
            saveLabel="Create Table"
            onCancel={this.props.onHideFn}
            onSave={ () => {
              this.props.onSaveFn(this.props.selectedTableId).then(() => this.props.onHideFn());
            }}
          />
        </Modal.Footer>
      </Modal>

    );
  }
});
