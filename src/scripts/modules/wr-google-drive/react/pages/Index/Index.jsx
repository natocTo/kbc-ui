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
import FilesList from '../../components/FilesList';
import FileModal from '../../components/FileModal';
import EmptyState from '../../../../components/react/components/ComponentEmptyState';
import LatestJobs from '../../../../components/react/components/SidebarJobs';
import LatestVersions from '../../../../components/react/components/SidebarVersionsWrapper';
import {Button} from 'react-bootstrap';
import {SearchBar} from '@keboola/indigo-ui';

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
            <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
              <ComponentDescription
                componentId={COMPONENT_ID}
                configId={this.state.configId}
              />
            </div>

            <div className="kbc-inner-padding kbc-inner-padding-with-bottom-border">
              {this.renderAuthorizedInfo()}
            </div>
            {this.renderSearchBar()}
            {
              this.hasTables() ?
                (
                  <div>
                    {this.isAuthorized() && (
                      <div className="kbc-inner-padding text-right">
                        <Button bsStyle="success" onClick={() => this.showTableModal(1, null)}>
                          <i className="kbc-icon-plus"/>
                          New Table
                        </Button>
                      </div>
                    )}
                    {this.renderFilesList()}
                  </div>
                )
                :
                this.renderEmptyItems()
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

    renderSearchBar() {
      if (this.hasTables()) {
        return (
          <div className="row-searchbar">
            <SearchBar
              onChange={this.handleSearchQueryChange}
              query={this.state.localState.get('searchQuery', '')}
            />
          </div>
        );
      }
      return null;
    },

    renderFilesList() {
      return (
        <FilesList
          componentId={COMPONENT_ID}
          configId={this.state.configId}
          inputTables={this.state.allTables}
          items={this.state.store.tables}
          onDeleteFn={this.state.actions.deleteTable}
          onEditFn={this.showTableModal}
          toggleEnabledFn={this.state.actions.toggleEnabled}
          isPendingFn={this.state.store.isPending}
          isDeletingFn={this.state.store.isDeleting}
          searchQuery={this.state.localState.get('searchQuery', '')}
          getRunSingleDataFn={this.state.store.getRunSingleData}
          {...this.state.actions.prepareLocalState('SheetsList')}
        />
      );
    },

    renderEmptyItems() {
      return (
        this.isAuthorized() ?
          <div className="row">
            <EmptyState>
              <p>No tables configured</p>
              <Button bsStyle="success" onClick={() => this.showTableModal(1, null)}>
                <i className="kbc-icon-plus"/>
                New Table
              </Button>
            </EmptyState>
          </div>
          : null
      );
    },

    renderAuthorizedInfo() {
      return (
        <AuthorizationRow
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

    renderTableModal() {
      return (
        <FileModal
          show={this.state.localState.get('showTableModal', false)}
          onHideFn={() => {
            this.state.actions.updateLocalState('showTableModal', false);
            this.state.actions.updateLocalState(['FileModal'], Map());
          }}
          onSaveFn={this.state.actions.saveTable}
          isSavingFn={this.state.store.isSaving}
          {...this.state.actions.prepareLocalState('FileModal')}
        />
      );
    },

    showTableModal(step, file) {
      const dirtyFile = file ? file : this.state.actions.touchFile();
      const mapping = file ? this.state.store.getInputMapping(file.get('tableId')) : Map();
      const modalData = Map()
        .set('file', dirtyFile)
        .set('cleanFile', file)
        .set('step', step)
        .set('uploadType', file ? 'existing' : 'new')
        .set('mapping', mapping)
        .set('cleanMapping', mapping)
        .set('exclude', this.state.store.mappings.filter((t) => t.get('source') !== dirtyFile.get('tableId')));
      this.state.actions.updateLocalState(['FileModal'], modalData);
      this.state.actions.updateLocalState('showTableModal', true);
    },

    isAuthorized() {
      return this.state.store.isAuthorized();
    },

    hasTables() {
      return this.state.store.hasTables;
    },

    invalidToRun() {
      if (!this.isAuthorized()) {
        return 'No Google account authorized';
      }
      if (!this.hasTables()) {
        return 'No tables registered for upload';
      }
      return '';
    },

    handleSearchQueryChange(query) {
      return this.state.actions.updateLocalState(['searchQuery'], query);
    },

    runParams() {
      return () => ({config: this.state.configId});
    },

    deleteCredentials() {
      deleteCredentialsAndConfigAuth(COMPONENT_ID, this.state.configId);
    }
  });
}
