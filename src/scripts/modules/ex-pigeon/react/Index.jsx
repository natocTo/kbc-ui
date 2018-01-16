import React from 'react';

import storeProvisioning, {storeMixins} from '../storeProvisioning';
import ComponentStore from '../../components/stores/ComponentsStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import RoutesStore from '../../../stores/RoutesStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import LatestJobsStore from '../../jobs/stores/LatestJobsStore';

// actions
import actionsProvisioning from '../actionsProvisioning';

// ui components
import ComponentMetadata from '../../components/react/components/ComponentMetadata';
import ComponentDescription from '../../components/react/components/ComponentDescription';
import LatestVersions from '../../components/react/components/SidebarVersionsWrapper';
import RunComponentButton from '../../components/react/components/RunComponentButton';
import DeleteConfigurationButton from '../../components/react/components/DeleteConfigurationButton';
import SaveButtons from '../../../react/common/SaveButtons';

import {FormGroup, FormControl, Form, ControlLabel, Col, Checkbox} from 'react-bootstrap';

const COMPONENT_ID = 'keboola.ex-pigeon';

export default React.createClass({
  mixins: [createStoreMixin(...storeMixins, InstalledComponentStore, LatestJobsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const store = storeProvisioning(configId);
    const actions = actionsProvisioning(configId);
    const component = ComponentStore.getComponent(COMPONENT_ID);

    return {
      configId: configId,
      store: store,
      actions: actions,
      component: component,
      isSaving: InstalledComponentStore.isSavingConfigData(COMPONENT_ID, configId),
      latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
      localState: store.getLocalState(),
      dirtyParameters: store.dirtyParameters
    };
  },
  render() {
    return (
        <div className="container-fluid">
            <div className="col-md-9 kbc-main-content">
                <div className="kbc-inner-content-padding-fix with-bottom-border">
                    <ComponentDescription
                        componentId={COMPONENT_ID}
                        configId={this.state.configId}
                    />
                </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            {this.renderButtons()}
            {this.renderConfigurationForm()}
          </div>
            </div>
            <div className="col-md-3 kbc-main-sidebar">
              <ComponentMetadata
                    configId={this.state.configId}
                    componentId={COMPONENT_ID}
                />
           <ul className="nav nav-stacked">
            <li>
              <RunComponentButton
                  title="Run"
                  component={COMPONENT_ID}
                  mode="link"
                  runParams={() => ({config: this.state.configId})}
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
                <LatestVersions
                    limit={3}
                    componentId={COMPONENT_ID}
                />
            </div>
        </div>
    );
  },
  renderConfigurationForm() {
    console.log('this.state Index', this.state);
    const formInstance = (
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>
              Email
            </Col>
            <Col sm={8}>
              <FormControl
                  type="email"
                  placeholder=""
                  disabled
                  value={this.state.store.requestedEmail}/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>
              Delimeter
            </Col>
            <Col sm={8}>
              <FormControl
                  type="text"
                  placeholder="Field delimeter used in CSV files"
                  value={this.state.dirtyParameters.get('delimiter')}
                  onChange={(e) => this.updateDirtyState(e, 'delimiter')}/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>
              Enclosure
            </Col>
            <Col sm={8}>
              <FormControl
                  type="text"
                  placeholder="Field enclosure used in CSV files"
                  value={this.state.dirtyParameters.get('enclosure')}
                  onChange={(e) => this.updateDirtyState(e, 'enclosure')}/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>
              Incremental
            </Col>
            <Col sm={8}>
              <Checkbox
                  value={this.state.dirtyParameters.get('incremental')}
                  checked={this.state.dirtyParameters.get('incremental')}
                  onChange={(e) => this.updateDirtyState(e, 'incremental')}>
                  Incremental load
              </Checkbox>
            </Col>
          </FormGroup>
        </Form>);

    return formInstance;
  },
  renderButtons() {
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.localState.get('isSaving', false)}
          isChanged={!this.state.dirtyParameters.equals(this.state.store.configData.get('parameters'))}
          onSave={this.state.actions.editSave}
          onReset={this.state.actions.resetDirtyParameters}
            />
      </div>
    );
  },
  updateDirtyState(event, parameter) {
    this.state.actions.updateDirtyParameters(parameter, event.target.value);
  }

});