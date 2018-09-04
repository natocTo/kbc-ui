import React, {PropTypes} from 'react';
// import {Map} from 'immutable';
import ConfirmButtons from '../../../../../react/common/ConfirmButtons';
import {Modal} from 'react-bootstrap';
// import {sanitizeTableName, sheetFullName} from '../../common';

export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    onHideFn: PropTypes.func,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    onSaveFn: PropTypes.func.isRequired
  },

  render() {
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Setup Anti-sampling
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-muted">
            <span>
              Sampling in Analytics is the practice of selecting a subset of data from your traffic and reporting on the trends available in that sample set. If your API call covers a date range greater than the set session limits, it will return a sampled call. To avoid this and get more precise results, you can use one of the following algorithms.
            </span>
          </div>
          <div className="form-horizontal clearfix">
            <div className="row">
              {this.renderBody()}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={false}
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            placement="right"
            saveLabel="Set"
            saveStyle="primary"
          />
        </Modal.Footer>
      </Modal>
    );
  },

  handleSave() {
    const value = this.props.localState.get('value');
    this.props.onSaveFn(value);
    this.props.onHideFn();
  },

  renderBody() {
    return (
      <div className="col-md-12">
        <div className="form-group">
          {/* <label className="control-label col-sm-3">
              Anti-sampling Algorithms
              </label> */}
        <div className="col-sm-9">
          {this.createRadioInput('Daily Walk algorithm', 'dailyWalk', 'Will make one request per date in the date range. You will get the most precise results, but it takes a lot of API calls.')}
          {this.createRadioInput('Adaptive algorithm', 'adaptive', 'Will divide the date range into multiple smaller date ranges. This is way faster, but might not be that precise.')}
          {this.createRadioInput('None', null, 'No anti-sampling algorithm used.')}
        </div>
        </div>

      </div>
    );
  },

  createRadioInput(name, value, description) {
    const currentValue = this.props.localState.get('value');
    return (
      <div className="radio">
        <label>
          <input type="radio"
            name="antisampling"
            id={name}
            value={value}
            checked={currentValue === value}
            onChange={() => this.onChange(value)}
          />
          {name}
          <small className="help-block">{description}</small>
        </label>

      </div>

    );
  },


  onChange(newVal) {
    this.props.updateLocalState('value', newVal);
  }

});
