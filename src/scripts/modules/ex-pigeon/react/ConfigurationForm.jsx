import React, {PropTypes} from 'react';
// import {Modal} from 'react-bootstrap';
// import TabbedWizard, {CRAWLER_KEY, AUTH_KEY, OPTIONS_KEY} from './TabbedWizard';
import {fromJS, Map} from 'immutable';
// import WizardButtons from '../../../components/react/components/WizardButtons';
import _ from 'underscore';
import actionsProvisioning from '../actionsProvisioning';
import storeProvisioning from '../storeProvisioning';
import RoutesStore from '../../../stores/RoutesStore';
export default React.createClass({

  getStateFromStores() {
    const componentId = 'keboola.ex-pigeon';
    const configId = RoutesStore.getCurrentRouteParam('config');
    const actions = actionsProvisioning(configId, componentId);
    const store = storeProvisioning(configId, componentId);


    return {
      store: store,
      actions: actions,
      configId: configId,
      localState: store.getLocalState()
    };
  },

  propTypes: {
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    onSave: PropTypes.func.isRequired
  },

  componentDidMount() {
  },

  render() {
    return (<div>KOMPONENTA</div>);
  },

  handleSave() {
    let crawlerSettings = JSON.parse(this.getSettings());
    crawlerSettings = _.isEmpty(crawlerSettings) ? null : fromJS(crawlerSettings);
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

  renderWizard() {
    return (
      <div
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

  localState(key, defaultValue) {
    return this.props.localState.getIn([].concat(key), defaultValue);
  },

  parameters() {
    return this.localState('parameters', this.props.parameters);
  },

  updateLocalState(path, value) {
    this.props.updateLocalState(path, value);
  }
});
