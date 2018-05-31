import React, {PropTypes} from 'react';
// import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import { PanelGroup, Panel } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import NewDimensionForm from './NewDimensionForm';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      dimensions: PropTypes.object.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      newDimension: {},
      showModal: false
    };
  },

  openModal(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({showModal: true});
  },

  closeModal() {
    if (!this.props.disabled) {
      this.setState({showModal: false, newDimension: {}});
    }
  },

  renderModal() {
    return (
      <Modal onHide={this.closeModal} show={this.state.showModal}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            + Create new dimenstions
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <NewDimensionForm
            value={this.state.newDimension}
            onChange={val => this.setState({newDimension: val})}
            disabled={this.props.disabled}
          />
        </Modal.Body>

        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.disabled}
            isDisabled={!this.isValid()}
            saveLabel="Create"
            onCancel={this.closeModal}
            onSave={this.handleCreate}/>
        </Modal.Footer>
      </Modal>
    );
  },

  isValid() {
    return true;
  },

  render() {
    const dimKeys = Object.keys(this.props.value.dimensions);
    const dimensions = this.props.value.dimensions;
    return (
      <div>
        {this.renderModal()}
        <PanelGroup
          accordion={true}
          className="kbc-accordion kbc-panel-heading-with-table">
          <Panel header={this.renderHeader()}>
            <span>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Include Time</th>
                    <th>Identifier</th>
                    <th>Template</th>
                    <th>{/* actions */}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    dimKeys.map(dimName => {
                      const dim = dimensions[dimName];
                      return (
                        <tr key={dimName}>
                          <td> {dimName}</td>
                          <td> {dim.includeTime ? 'yes' : 'no'}</td>
                          <td> {dim.identifier}</td>
                          <td> {dim.template}</td>
                          <td> delete todo</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </span>
          </Panel>
        </PanelGroup>
      </div>
    );
  },

  renderHeader() {
    return (
      <span>
        <div>
          Dimensions
        </div>
        <div className="text-right">
          <button
            disabled={this.props.disabled}
            onClick={this.openModal}
            className="btn btn-success">
            + New Dimensions
          </button>
        </div>
      </span>
    );
  },

  handleCreate(e) {
    e.preventDefault();
    e.stopPropagation();
    const newDimension = {...this.state.newDimension};
    const name = this.state.newDimension.name;
    delete newDimension.name;
    const dimensionsToSave = {...this.props.value.dimensions, [name]: newDimension};
    this.props.onSave({dimensions: dimensionsToSave}).then(this.closeModal);
  }
});
