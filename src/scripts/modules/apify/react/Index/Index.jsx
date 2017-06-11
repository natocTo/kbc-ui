import React from 'react';
import {Map} from 'immutable';

// stores
import storeProvisioning, {storeMixins} from '../../storeProvisioning';
import ComponentStore from '../../../components/stores/ComponentsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import LatestJobsStore from '../../../jobs/stores/LatestJobsStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import storageTablesStore from '../../../components/stores/StorageTablesStore';

// actions
import actionsProvisioning from '../../actionsProvisioning';

// ui components
import ComponentDescription from '../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import LatestJobs from '../../../components/react/components/SidebarJobs';
import LatestVersions from '../../../components/react/components/SidebarVersionsWrapper';
import SetupModal from './SetupModal';

import CodeMirror from 'react-code-mirror';
/* global require */
require('codemirror/addon/lint/lint');
require('../../../../utils/codemirror/json-lint');


// import {Button} from 'react-bootstrap';

const COMPONENT_ID = 'apify.apify';

export default React.createClass({
  mixins: [createStoreMixin(...storeMixins, LatestJobsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const store = storeProvisioning(configId);
    const actions = actionsProvisioning(configId);
    const component = ComponentStore.getComponent(COMPONENT_ID);

    return {
      allTables: storageTablesStore.getAll(),
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
      store: store,
      actions: actions,
      component: component,
      configId: configId,
      localState: store.getLocalState()
    };
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-header kbc-header-without-row-fix">
            <div className="col-sm-12">
              <ComponentDescription
                componentId={COMPONENT_ID}
                configId={this.state.configId}
              />
            </div>
          </div>
          <div className="kbc-header kbc-header-without-row-fix">
            {this.renderSetupModal()}
            {this.renderStartSetup()}
            {this.renderStatic()}
          </div>
        </div>

        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            configId={this.state.configId}
            componentId={COMPONENT_ID}
          />
          <ul className="nav nav-stacked">
            <li className={!!this.invalidToRun() ? 'disabled' : null}>
              <RunComponentButton
                title="Upload"
                component={COMPONENT_ID}
                mode="link"
                runParams={this.runParams()}
                disabled={!!this.invalidToRun()}
                disabledReason={this.invalidToRun()}
              >
                You are about to upload data.
              </RunComponentButton>
            </li>
            <li>
              <DeleteConfigurationButton
                componentId={COMPONENT_ID}
                configId={this.state.configId}
              />
            </li>
          </ul>
          <LatestJobs jobs={this.state.latestJobs} limit={3} />
          <LatestVersions
            limit={3}
            componentId={COMPONENT_ID}
          />
        </div>
      </div>
    );
  },

  renderSetupModal() {
    const {localState, actions} = this.state;
    const path = ['SetupModal'];
    const showPath = path.concat('show');
    const closeFn = () => {
      this.updateLocalState(showPath, false);
    };
    return (
      <SetupModal
        show={localState.getIn(showPath, false)}
        onHideFn={closeFn}
        {...actions.prepareLocalState(path.concat('data'))}
        loadCrawlers={actions.loadCrawlers}
        onSave={(params) => actions.saveParams(params).then(closeFn)}
        isSaving={localState.get('saving')}
      />
    );
  },

  showSetupModal() {
    this.updateLocalState('SetupModal', Map());
    this.updateLocalState(['SetupModal', 'show'], true);
  },

  renderStartSetup() {
    return (
      <div>
        <button className="btn btn-success" onClick={this.showSetupModal}>
          Setup
        </button>
      </div>
    );
  },

  renderStatic() {
    const parameters = this.state.store.parameters;
    const crawler = this.renderCrawlerStatic(parameters);
    const user = <p className="form-control-static">{parameters.get('userId')}</p>;
    const settings = <div className="form-control-static"> {this.renderStaticCralwerSettings(parameters.get('crawlerSettings').toJS())}</div>;

    return (
      <div className="form-horizontal">
      {this.renderStaticFormGroup('User ID', user)}
      {this.renderStaticFormGroup('Crawler', crawler)}
      {this.renderStaticFormGroup('Crawler Settings', settings)}
      </div>
    );
  },

  renderCrawlerStatic(parameters) {
    const cname = parameters.get('customId', parameters.get('crawlerId'));
    return (
      <p className="form-control-static">
        {parameters.get('settingsLink') ?
         <a target="_blank" href={parameters.get('settingsLink')}>
           {cname}
         </a>
         : <span> {cname} </span>
        }
      </p>
    );
  },

  renderStaticFormGroup(controlLabel, control, helpText) {
    return (
      <div className={'form-group'}>
        <label className="col-xs-2 control-label">
          {controlLabel}
        </label>
        <div className="col-xs-10">
          {control}
          <span className="help-block">
            {helpText}
          </span>
        </div>
      </div>
    );
  },

  renderStaticCralwerSettings(data) {
    let value = '{}';
    if (data) {
      value = JSON.stringify(data, null, '  ');
    }
    return (
      <CodeMirror
        theme="solarized"
        lineNumbers={true}
        defaultValue={value}
        readOnly={true}
        cursorHeight={0}
        mode="application/json"
        lineWrapping={true}
      />
    );
  },

  invalidToRun() {
    return '';
  },

  runParams() {
    return () => ({config: this.state.configId});
  },

  updateLocalState(path, data) {
    this.state.actions.updateLocalState(path, data);
  }

});
