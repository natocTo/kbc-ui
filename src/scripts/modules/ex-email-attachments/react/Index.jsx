import React from 'react';

import storeProvisioning, {storeMixins} from '../storeProvisioning';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import RoutesStore from '../../../stores/RoutesStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import LatestJobsStore from '../../jobs/stores/LatestJobsStore';

// actions
import actionsProvisioning from '../actionsProvisioning';

// ui components
import ComponentMetadata from '../../components/react/components/ComponentMetadata';
import ComponentDescription from '../../components/react/components/ComponentDescription';
import {RefreshIcon} from '@keboola/indigo-ui';
import LatestVersions from '../../components/react/components/SidebarVersionsWrapper';
import RunComponentButton from '../../components/react/components/RunComponentButton';
import DeleteConfigurationButton from '../../components/react/components/DeleteConfigurationButton';
import LatestJobs from '../../components/react/components/SidebarJobs';
import ConfigurationForm from './ConfigurationForm';
import StorageTablesStore from '../../components/stores/StorageTablesStore';
import StorageBucketsStore from '../../components/stores/StorageBucketsStore';
import ClipboardButton from '../../../react/common/Clipboard';
import SapiTableLinkEx from '../../components/react/components/StorageApiTableLinkEx';
import getDefaultBucket from '../../../utils/getDefaultBucket';
import {FormGroup, FormControl, Form, ControlLabel, Col, InputGroup, Button, HelpBlock} from 'react-bootstrap';
import Processors from '../../components/react/components/Processors';


const COMPONENT_ID = 'keboola.ex-email-attachments';

export default React.createClass({
  mixins: [createStoreMixin(...storeMixins, InstalledComponentStore, StorageTablesStore, StorageBucketsStore, LatestJobsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const store = storeProvisioning(configId);
    const actions = actionsProvisioning(configId);

    return {
      configId: configId,
      store: store,
      actions: actions,
      tables: StorageTablesStore.getAll(),
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
      localState: store.getLocalState(),
      settings: store.settings,
      processors: store.processors
    };
  },

  componentDidMount() {
    this.state.actions.requestEmailAndInitConfig();
  },

  renderClipboardButton() {
    return (<ClipboardButton text={this.state.store.requestedEmail} label="Copy email" />);
  },


  getDefaultBucketName() {
    return getDefaultBucket('in', COMPONENT_ID, this.state.configId) + '.data';
  },

  renderImportedResult() {
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={4}>
          Output Table
        </Col>
        <Col sm={8}>
          <InputGroup>
            <SapiTableLinkEx tableId={this.getDefaultBucketName()}/>
          </InputGroup>
          <HelpBlock>
            Table in Storage, where the .csv attachments will be imported. If the table or bucket does not exist, it will be created.
          </HelpBlock>
        </Col>
      </FormGroup>
    );
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
            <ComponentDescription
              componentId={COMPONENT_ID}
              configId={this.state.configId}
            />
          </div>
          {this.state.store.requestedEmail ?
            <div>
              <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
                <Form horizontal>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>
                  Email address
                    </Col>
                    <Col sm={8}>
                      <InputGroup>
                        <FormControl
                          type="email"
                          placeholder="Creating email, please wait"
                          readOnly
                          value={this.state.store.requestedEmail}
                          title="Email address generated by Email Attachments"/>
                        <InputGroup.Button>
                          <Button>
                            {this.renderClipboardButton()}
                          </Button>
                        </InputGroup.Button>
                      </InputGroup>
                      <HelpBlock>
                      Please send emails with .csv attachment to this email address.
                      Received attachments will be imported after configuration execution. Only new emails are imported on subsequent executions.
                      </HelpBlock>
                    </Col>
                  </FormGroup>
                  {this.renderImportedResult()}
                </Form>
              </div>
              <ConfigurationForm
                incremental={this.state.settings.get('incremental')}
                delimiter={this.state.settings.get('delimiter')}
                enclosure={this.state.settings.get('enclosure')}
                primaryKey={this.state.settings.get('primaryKey')}
                onChange={this.state.actions.editChange}
                requestedEmail={this.state.store.requestedEmail}
                actions={this.state.actions}
                localState={this.state.localState}
              />
              {this.renderProcessors()}
            </div>
            :
            this.renderInitConfig()
          }
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            configId={this.state.configId}
            componentId={COMPONENT_ID}
          />
          <ul className="nav nav-stacked">
            <li className={!!this.invalidToRun() ? 'disabled' : null}>
              <RunComponentButton
                title="Run"
                component={COMPONENT_ID}
                mode="link"
                runParams={() => ({config: this.state.configId})}
                disabled={!!this.invalidToRun()}
                disabledReason={this.invalidToRun() ? this.invalidToRun() : null}
              >
                <span>You are about to run an extraction.</span>
              </RunComponentButton>
            </li>
            <li>
              <DeleteConfigurationButton
                componentId={COMPONENT_ID}
                configId={this.state.configId}
              />
            </li>
          </ul>
          <LatestJobs
            jobs={this.state.latestJobs}
            limit={3}
          />
          <LatestVersions
            componentId={COMPONENT_ID}
          />
        </div>
      </div>
    );
  },

  renderInitConfig() {
    if (this.state.store.error) {
      return this.renderError();
    } else {
      // if we either have email or it is being generated
      return (
        <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
          <p>
            <RefreshIcon isLoading={true}/> Generating email address, please wait.
          </p>
        </div>
      );
    }
  },

  renderError() {
    const error = this.state.store.error;
    const code = error.code;
    let message = 'Unexpected error';
    try {
      const jsError = JSON.parse(error).error;
      message = jsError.message || jsError;
    } catch (e) {
      message = error.message || error;
    }

    return (
      <div className="alert alert-danger">
        Error: {message}
        <div>
          {code >= 500 ? error.get('exceptionId') : null}
        </div>
      </div>
    );
  },

  invalidToRun() {
    if (!this.state.settings.get('enclosure') || !this.state.settings.get('delimiter') || !this.state.settings.get('email')) {
      return 'Configuration has missing values';
    }
    if (this.state.localState.get('isChanged', false)) {
      return 'Configuration is not saved';
    }

    return false;
  },

  renderProcessors() {
    if (this.state.processors === '{}') {
      return null;
    }
    return (
      <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
        <Processors
          value={this.state.localState.get('processors', this.state.processors)}
          onEditCancel={this.state.actions.editProcessorsReset}
          onEditChange={this.state.actions.editProcessorsChange}
          onEditSubmit={this.state.actions.editProcessorsSave}
          isSaving={this.state.localState.get('isProcessorsSaving', false)}
          isChanged={this.state.localState.hasIn(['isProcessorsChanged'])}
          isEditingValid={this.onEditProcessorsIsValid()}
        />
      </div>
    );
  },

  onEditProcessorsIsValid() {
    if (this.state.localState.get('processors') === '{}' || this.state.localState.get('processors') === '') {
      return true;
    }
    try {
      JSON.parse(this.state.localState.get('processors'));
      return true;
    } catch (e) {
      return false;
    }
  }
});
