import React from 'react';

// stores
import ConfigRowsStore from '../../../components/stores/ConfigRowsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';

// actions
import configRowActions from '../../../components/ConfigRowsActionCreators';

// global components
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import ConfigurationRowDescription from '../../../components/react/components/ConfigurationRowDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import DeleteConfigurationButton from '../../../components/react/components/DeleteConfigurationButton';
import JSONConfiguration from '../../../components/react/components/JSONConfiguration';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(ConfigRowsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const rowId = RoutesStore.getCurrentRouteParam('row');
    const row = ConfigRowsStore.get(COMPONENT_ID, configId, rowId);
    return {
      configId: configId,
      rowId: rowId,
      row: row,
      jsonDataString: ConfigRowsStore.getEditingJSONDataString(COMPONENT_ID, configId, rowId),
      isJSONEditingSaving: ConfigRowsStore.getPendingActions(COMPONENT_ID, configId, rowId).has('save-json-data'),
      isJSONEditingValid: ConfigRowsStore.isEditingJSONDataStringValid(COMPONENT_ID, configId, rowId),
      isJSONEditingChanged: ConfigRowsStore.isEditingJSONDataString(COMPONENT_ID, configId, rowId)
    };
  },

  render() {
    const state = this.state;
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ConfigurationRowDescription
              componentId={COMPONENT_ID}
              configId={this.state.configId}
              rowId={this.state.rowId}
            />
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <h3>TODO</h3>
            <ul>
              <li>Dummy config for empty state</li>
              <li>JSON editor documentation link</li>
              <li>Visual editor && switching</li>
              <li>Unify headlines</li>
              <li>Right bar content</li>
            </ul>
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <JSONConfiguration
              isSaving={this.state.isJSONEditingSaving}
              jsonData={this.state.jsonDataString}
              isEditingValid={this.state.isJSONEditingValid}
              isChanged={this.state.isJSONEditingChanged}
              onEditCancel={function() {
                return configRowActions.resetJSONDataString(COMPONENT_ID, state.configId, state.rowId);
              }}
              onEditChange={function(jsonDataString) {
                return configRowActions.updateJSONDataString(COMPONENT_ID, state.configId, state.rowId, jsonDataString);
              }}
              onEditSubmit={function() {
                return configRowActions.saveJSONDataString(COMPONENT_ID, state.configId, state.rowId);
              }}
            />
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={COMPONENT_ID}
            configId={this.state.configId}
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
        </div>
      </div>
    );
  }
});
