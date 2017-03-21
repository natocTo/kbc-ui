import React from 'react';
import {Map} from 'immutable';

// stores
import storeProvisioning, {storeMixins} from '../../../storeProvisioning';
import ComponentStore from '../../../../components/stores/ComponentsStore';
import RoutesStore from '../../../../../stores/RoutesStore';
import LatestJobsStore from '../../../../jobs/stores/LatestJobsStore';
import createStoreMixin from '../../../../../react/mixins/createStoreMixin';
import storageTablesStore from '../../../../components/stores/StorageTablesStore';

// actions
import {deleteCredentialsAndConfigAuth} from '../../../../oauth-v2/OauthUtils';
import actionsProvisioning from '../../../actionsProvisioning';

// ui components
import AuthorizationRow from '../../../../oauth-v2/react/AuthorizationRow';
import ComponentDescription from '../../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../../components/react/components/ComponentMetadata';
import RunComponentButton from '../../../../components/react/components/RunComponentButton';
import DeleteConfigurationButton from '../../../../components/react/components/DeleteConfigurationButton';
import SheetsList from '../../components/SheetsList';
import SheetModal from '../../components/SheetModal';
import EmptyState from '../../../../components/react/components/ComponentEmptyState';
import LatestJobs from '../../../../components/react/components/SidebarJobs';
import LatestVersions from '../../../../components/react/components/SidebarVersionsWrapper';
import {Button} from 'react-bootstrap';

export default function(COMPONENT_ID) {
  return React.createClass({
    mixins: [createStoreMixin(...storeMixins, LatestJobsStore, storageTablesStore)],

    getStateFromStores() {
      const configId = RoutesStore.getCurrentRouteParam('config');
      const store = storeProvisioning(COMPONENT_ID, configId);
      const actions = actionsProvisioning(COMPONENT_ID, configId);
      const component = ComponentStore.getComponent(COMPONENT_ID);

      return {
        allTables: storageTablesStore.getAll(),
        latestJobs: LatestJobsStore.getJobs(COMPONENT_ID, configId),
        store: store,
        actions: actions,
        component: component,
        configId: configId,
        authorizedEmail: store.oauthCredentials.get('authorizedFor'),
        oauthCredentials: store.oauthCredentials,
        oauthCredentialsId: store.oauthCredentialsId,
        localState: store.getLocalState()
      };
    },

    render() {
      return (
        <div className="container-fluid">
          {this.renderTableModal()}
          <div className="col-md-9 kbc-main-content">
            <div className="row kbc-header">
              <div className="col-sm-12">
                <ComponentDescription
                  componentId={COMPONENT_ID}
                  configId={this.state.configId}
                />
              </div>
            </div>
            <div className="row">
              {this.renderAuthorizedInfo('col-xs-6')}
            </div>
            <div className="row" style={{'padding-left': 0, 'padding-right': 0}}>
              {
                this.state.store.hasTables ?
                  <SheetsList
                    componentId={COMPONENT_ID}
                    configId={this.state.configId}
                    inputTables={this.state.allTables}
                    items={this.state.store.tables}
                    onAddFn={this.showTableModal}
                    onDeleteFn={this.state.actions.deleteTable}
                    onEditFn={this.showTableModal}
                    toggleEnabledFn={this.state.actions.toggleEnabled}
                    isPendingFn={this.state.store.isPending}
                    getRunSingleDataFn={this.state.store.getRunSingleData}
                  />
                  :
                  this.renderEmptyItems()
              }
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

    renderEmptyItems() {
      return (
        this.isAuthorized() ?
          <div className="row">
            <EmptyState>
              <p>No tables configured</p>
              <Button bsStyle="success" onClick={() => this.showTableModal(1, null)}>
                Add Table
              </Button>
            </EmptyState>
          </div>
          : null
      );
    },

    renderTableModal() {
      return (
        <SheetModal
          email=""
          show={this.state.localState.get('showTableModal', false)}
          onHideFn={() => {
            this.state.actions.updateLocalState(['SheetModal'], Map());
            this.state.actions.updateLocalState('showTableModal', false);
          }}
          onSaveFn={this.state.actions.saveTable}
          isSavingFn={this.state.store.isSaving}
          {...this.state.actions.prepareLocalState('SheetModal')}
        />
      );
    },

    showTableModal(step, sheet) {
      const dirtySheet = sheet ? sheet : this.state.actions.touchSheet();
      const mapping = sheet ? this.state.actions.getMapping(sheet) : Map();
      const modalData = Map()
        .set('sheet', dirtySheet)
        .set('currentSheet', sheet)
        .set('step', step)
        .set('uploadType', 'new')
        .set('mapping', mapping);
      this.state.actions.updateLocalState(['SheetModal'], modalData);
      this.state.actions.updateLocalState('showTableModal', true);
    },

    isAuthorized() {
      return this.state.store.isAuthorized();
    },

    invalidToRun() {
      if (!this.isAuthorized()) {
        return 'No Google account authorized';
      }
      return false;
    },

    renderAuthorizedInfo(clName) {
      return (
        <AuthorizationRow
          className={this.isAuthorized() ? clName : 'col-xs-12'}
          id={this.state.oauthCredentialsId}
          configId={this.state.configId}
          componentId={COMPONENT_ID}
          credentials={this.state.oauthCredentials}
          isResetingCredentials={false}
          onResetCredentials={this.deleteCredentials}
          showHeader={false}
        />
      );
    },

    runParams() {
      return () => ({config: this.state.configId});
    },

    deleteCredentials() {
      deleteCredentialsAndConfigAuth(COMPONENT_ID, this.state.configId);
    }
  });
}
