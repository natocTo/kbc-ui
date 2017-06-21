import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import TabbedWizard, {AUTH_KEY, OPTIONS_KEY} from './TabbedWizard';
import {fromJS, Map} from 'immutable';
import WizardButtons from '../../../components/react/components/WizardButtons';

export default React.createClass({

  propTypes: {
    onHideFn: PropTypes.func,
    show: PropTypes.bool.isRequired,
    localState: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired,
    loadCrawlers: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    onSave: PropTypes.func.isRequired
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
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            isSaving={this.props.isSaving}
            isSaveDisabled={!this.canSave()}
            isNextDisabled={!this.canNext()}
            isPreviousDisabled={step === 1}
            showNext={step < 3}
            showSave={true}
            savingMessage=""
          />
        </Modal.Footer>
      </Modal>

    );
  },

  handleSave() {
    const crawlerSettings = fromJS(JSON.parse(this.getSettings()));
    let paramsToSave = this.parameters();
    const action = this.getAction();
    if (action === 'crawler') {
      const crawlerId = paramsToSave.get('crawlerId');
      const crawler = this.localState(['crawlers', 'data']).find((c) => c.get('id') === crawlerId);
      paramsToSave = paramsToSave
        .set('customId', crawler.get('customId'))
        .set('settingsLink', crawler.get('settingsLink'))
        .set('crawlerSettings', crawlerSettings)
        .delete('executionId');
    }
    this.props.onSave(paramsToSave.delete('action'));
  },

  canNext() {
    const step = this.step();
    if (step === AUTH_KEY) return this.hasAuth();
    return true;
  },

  getSettings() {
    return this.localState('settings', '{}');
  },

  isSettingsValid() {
    try {
      JSON.parse(this.getSettings());
      return true;
    } catch (e) {
      return false;
    }
  },

  hasAuth() {
    const params = this.parameters();
    return !!params.get('userId') && !!params.get('#token');
  },

  getAction() {
    const params = this.parameters();
    const action = params.get('action', !!params.get('executionId') ? 'executionId' : 'crawler');
    return action;
  },

  hasCrawler() {
    const params = this.parameters();
    const action = this.getAction();
    return action === 'executionId' ? !!params.get('executionId') : !!params.get('crawlerId');
  },

  canSave() {
    const hasAuth = this.hasAuth();
    const hasCrawler = this.hasCrawler();
    const hasSettingsValid = this.isSettingsValid();
    return hasAuth && hasCrawler && hasSettingsValid;
  },

  cycleTab(delta) {
    let newStep = this.step() + delta;
    newStep = newStep === 0 ? AUTH_KEY : newStep;
    newStep = newStep > 3 ? AUTH_KEY : newStep;
    if (newStep === OPTIONS_KEY && this.getAction() === 'crawler') this.onLoadCrawlers();
    this.updateLocalState('step', newStep);
  },

  renderWizard() {
    return (
      <TabbedWizard
        loadCrawlers={this.onLoadCrawlersForce}
        crawlers={this.localState('crawlers', Map())}
        step={this.step()}
        action={this.getAction()}
        selectTab={(s) => this.updateLocalState('step', s)}
        localState={this.props.localState}
        updateLocalState={this.props.updateLocalState}
        parameters={this.parameters()}
        updateParameters={(parameters) => this.updateLocalState('parameters', parameters)}
        settings={this.getSettings()}
        updateSettings={(val) => this.updateLocalState('settings', val)}
      />
    );
  },

  onLoadCrawlers() {
    if (this.localState('crawlers')) return;
    this.onLoadCrawlersForce();
  },

  onLoadCrawlersForce() {
    this.updateLocalState(['crawlers'], Map({'loading': true, 'error': null}));
    this.props.loadCrawlers(this.parameters()).then((data) => {
      const crawlers = {
        data: data.status !== 'error' ? data : null,
        loading: false,
        error: data.status === 'error' ? 'Error: ' + data.message : null
      };
      return this.updateLocalState('crawlers', fromJS(crawlers));
    }).catch(() =>
      this.updateLocalState('crawlers', fromJS({loading: false, data: null, error: 'Error Loading Crawlers'}))
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

  parameters() {
    return this.localState('parameters', this.props.parameters);
  },

  step() {
    return this.localState('step', AUTH_KEY);
  },

  updateLocalState(path, value) {
    this.props.updateLocalState(path, value);
  }

});
