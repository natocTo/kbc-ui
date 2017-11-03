import React from 'react';
import Immutable, {List, Map, fromJS} from 'immutable';

import Promise from 'bluebird';

import storageActions from '../../components/StorageActionCreators';
import tablesStore from '../../components/stores/StorageTablesStore';

import TableLinkModalDialog from './components/ModalDialog';

import createStoreMixin from '../../../react/mixins/createStoreMixin';

import RoutesStore from '../../../stores/RoutesStore';
import {PATH_PREFIX} from '../routes';
import tableBrowserStore from '../flux/store';
import tableBrowserActions from '../flux/actions';
import createActionsProvisioning from '../actionsProvisioning';
import createStoreProvisioning from '../storeProvisioning';

export default React.createClass({

  mixins: [createStoreMixin(tablesStore, tableBrowserStore)],

  getStateFromStores() {
    const tableId  = tableBrowserStore.getCurrentTableId();
    const localState = tableBrowserStore.getLocalState(tableId);

    const tables = tablesStore.getAll() || Map();
    const table = tables.get(tableId, Map());

    return {
      moreTables: List(), // context tables TBA
      tableId: tableId,
      table: table,
      actions: createActionsProvisioning(tableId),
      localState: localState,
      store: createStoreProvisioning(tableId)
    };
  },

  getLocalState(path) {
    return this.state.localState.getIn([].concat(path));
  },

  setLocalState(newStateObject) {
    const keysToUpdate = Object.keys(newStateObject);
    const newLocalState = keysToUpdate.reduce((memo, key) => memo.set(key, newStateObject[key]),
      this.state.localState
    );
    tableBrowserActions.setLocalState(this.state.tableId, newLocalState);
  },

  componentWilUnmount() {
    this.state.actions.stopEventService();
    this.state.actions.stopPollingDataProfilerJob();
  },


  render() {
    return (
      <span key="mainspan">
        {this.renderModal()}
      </span>
    );
  },

  renderModal() {
    return (
      <TableLinkModalDialog
        moreTables={this.state.moreTables.toArray()}
        tableId={this.state.tableId}
        reload={this.reload}
        tableExists={this.state.store.tableExists()}
        omitFetches={this.getLocalState('omitFetches')}
        omitExports={this.getLocalState('omitExports')}
        onHideFn={this.onHide}
        isLoading={this.state.store.isLoadingAll()}
        table={this.state.table}
        dataPreview={this.getLocalState('dataPreview')}
        dataPreviewError={this.getLocalState('dataPreviewError')}
        onOmitExportsFn={this.state.actions.setEventsFilter('omitExports')}
        onOmitFetchesFn={this.state.actions.setEventsFilter('omitFetches')}
        events={this.getLocalState('events')}
        enhancedAnalysis={this.getLocalState('profilerData')}
        onRunAnalysis={this.state.actions.onRunEnhancedAnalysis}
        isCallingRunAnalysis={this.getLocalState('isCallingRunAnalysis')}
        loadingProfilerData={this.getLocalState('loadingProfilerData')}
        isRedshift={this.state.store.isRedshift()}
        onChangeTable={this.changeTable}
        filterIOEvents={this.getLocalState('filterIOEvents')}
        onFilterIOEvents={this.state.actions.setEventsFilter('filterIOEvents')}
        onShowEventDetail={(eventId) => this.setLocalState({detailEventId: eventId})}
        detailEventId={this.getLocalState('detailEventId')}
      />
    );
  },

  redirectBack() {
    const routerState = RoutesStore.getRouterState();
    const currentPath = routerState.get('path') || '';
    const parts = currentPath.split(`/${PATH_PREFIX}/`);
    const backPath = parts ? parts[0] : '/';
    RoutesStore.getRouter().transitionTo(backPath || '/');
  },

  onHide() {
    this.state.actions.stopPollingDataProfilerJob();
    this.state.actions.stopEventService();
    this.redirectBack();
  },

  reload() {
    Promise.props( {
      'loadAllTablesFore': storageActions.loadTablesForce().then(() => this.state.actions.findEnhancedJob()),
      'exportData': this.state.actions.exportDataSample(),
      'loadEvents': this.state.store.eventService.load()
    });
  },

  loadAll() {
    this.state.actions.exportDataSample();
    this.state.actions.startEventService();
    this.state.actions.findEnhancedJob();
  },

  changeTable(newTableId, dontLoadAll) {
    const initLocalState = fromJS({
      detailEventId: null,
      isCallingRunAnalysis: false,
      profilerData: Map(),
      loadingPreview: false,
      loadingProfilerData: false,
      dataPreview: Immutable.List(),
      dataPreviewError: null,
      events: Immutable.List()
    });
    tableBrowserActions.setCurrentTableId(newTableId, initLocalState);
    if (!dontLoadAll) {
      this.state.actions.resetTableEvents();
      this.loadAll();
    }
  }

});
