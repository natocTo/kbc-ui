import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import TabbedWizard, {AUTH_KEY} from './TabbedWizard';
import {Map} from 'immutable';
import WizardButtons from '../../../components/react/components/WizardButtons';

export default React.createClass({

  propTypes: {
    onHideFn: PropTypes.func,
    show: PropTypes.bool.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired,
    loadCrawlers: PropTypes.func.isRequired
  },

  render() {
    const step = this.step();
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}>
        <Modal.Header closeButton>
          <Modal.Title>
            Setup Crawler
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderWizard()}
        </Modal.Body>
        <Modal.Footer>
          <WizardButtons
            onNext={() => this.cycleTab(1)}
            onPrevious={() => this.cycleTab(-1)}
            onSave={() => null}
            onCancel={this.props.onHideFn}
            isSaving={false}
            isSaveDisabled={false}
            isNextDisabled={false}
            isPreviousDisabled={step === 1}
            showNext={step < 3}
            showSave={true}
            savingMessage="Saving"
          />
        </Modal.Footer>
      </Modal>

    );
  },


  cycleTab(delta) {
    let newStep = this.step() + delta;
    newStep = newStep === 0 ? AUTH_KEY : newStep;
    newStep = newStep > 3 ? AUTH_KEY : newStep;
    this.updateLocalState('step', newStep);
  },

  renderWizard() {
    return (
      <TabbedWizard
        loadCrawlers={this.props.loadCrawlers}
        step={this.step()}
        localState={this.props.localState}
        updateLocalState={this.props.updateLocalState}
        settings={this.localState('settings', Map())}
        updateSettings={(settings) => this.updateLocalState('settings', settings)}
      />
    );
  },

  renderInputControl(propertyPath, placeholder) {
    return (
      <input
        placeholder={placeholder}
        type="text"
        value={1}
        onChange={() => null}
        className="form-control"
      />
    );
  },


  renderFormControl(controlLabel, control, helpText, errorMsg) {
    return (
      <div className={errorMsg ? 'form-group has-error' : 'form-group'}>
        <label className="col-xs-2 control-label">
          {controlLabel}
        </label>
        <div className="col-xs-10">
          {control}
          <span className="help-block">
            {errorMsg || helpText}
          </span>
        </div>
      </div>
    );
  },

  localState(key, defaultValue) {
    return this.props.localState.getIn([].concat(key), defaultValue);
  },

  step() {
    return this.localState('step', AUTH_KEY);
  },

  updateLocalState(path, value) {
    this.props.updateLocalState(path, value);
  }

});
