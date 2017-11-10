import React, {PropTypes} from 'react';

import {fromJS} from 'immutable';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../../../react/common/ConfirmButtons';
import Select from 'react-select';
import ChangedSinceInput from '../../../../components/react/components/generic/ChangedSinceFilterInput';
import {Input} from '../../../../../react/common/KbcBootstrap';


export default React.createClass({
  propTypes: {
    columns: PropTypes.object.isRequired,
    currentPK: PropTypes.object.isRequired,
    currentMapping: PropTypes.string,
    isIncremental: PropTypes.bool,
    onSave: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    isSaving: React.PropTypes.bool.isRequired
  },

  getStateFromProps(props) {
    return {
      primarykey: props.currentPK,
      mapping: props.currentMapping,
      isIncremental: props.isIncremental
    };
  },

  getInitialState() {
    return this.getStateFromProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSaving) return;
    this.setState(this.getStateFromProps(nextProps));
  },

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Setup Incremental Load
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form form-horizontal">
            <Input type="checkbox"
              wrapperClassName="col-sm-offset-3 col-sm-9"
              label="Enable Incremental Load"
              checked={this.state.isIncremental}
              onChange={(e) => this.setState({isIncremental: e.target.checked})}
              help="With incremental load enabled, writer will append rows to the destiantion table and/or updates existing rows identified by primary key if specified."
            />
            <span>
              <div className="form-group form-group-sm">
                <label htmlFor="title" className="col-sm-3 control-label">
                  Destination Table Primary Key
                </label>
                <div className="col-sm-9">
                  {this.renderPKSelector()}
                  <span className="help-block">
                    Helps to identify the identical rows.
                  </span>
                </div>
              </div>
              <ChangedSinceInput
                labelClassName="col-sm-3"
                wrapperClassName="col-sm-9"
                onChange={(value) => this.setState({mapping: value})}
                label="Source table data changed in last"
                mapping={this.state.mapping}
                helpBlock="Filter and only send the source data changed within the specified period. Mostly helpful when the data are being updated on a regular basis."
              />
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            saveLabel="Save"
            isSaving={this.props.isSaving}
            isDisabled={false}
            onCancel={this.closeModal}
            onSave={this.handleSave}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  renderPKSelector() {
    return (
      <Select
        placeholder="select from database column names"
        clearable={false}
        key="primary key select"
        name="pkelector"
        multi={true}
        value={this.state.primarykey}
        onChange= {(newValue) => this.setState({primarykey: newValue.map(v => v.value).join(',')})}
        options= {this.getColumns()}
      />);
  },

  getColumns() {
    const result = this.props.columns.map((key) => {
      return {
        'label': key,
        'value': key
      };
    }).toList().toJS();
    return result;
  },

  closeModal() {
    this.props.onHide();
  },

  handleSave() {
    let pkToSave = [];
    pkToSave = this.state.primarykey ? this.state.primarykey.split(',') : [];
    this.props.onSave(this.state.isIncremental, fromJS(pkToSave), this.state.mapping).then(() =>
      this.closeModal()
    );
  }
});
