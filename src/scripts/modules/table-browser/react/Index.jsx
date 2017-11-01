import React from 'react';
import Immutable, {List, Map, fromJS} from 'immutable';
import _ from 'underscore';
import Promise from 'bluebird';
import moment from 'moment';
import filesize from 'filesize';
import later from 'later';

import storageActions from '../../components/StorageActionCreators';
import storageApi from '../../components/StorageApi';
import tablesStore from '../../components/stores/StorageTablesStore';

import TableLinkModalDialog from './components/ModalDialog';
import {startDataProfilerJob, getDataProfilerJob, fetchProfilerData} from './components/DataProfilerUtils';

import createStoreMixin from '../../../react/mixins/createStoreMixin';

import RoutesStore from '../../../stores/RoutesStore';
import {PATH_PREFIX} from '../routes';
import tableBrowserStore from '../store';
import tableBrowserActions from '../actions';
import utils from '../utils';

export default React.createClass({

  mixins: [createStoreMixin(tablesStore, tableBrowserStore)],

  /*
     propTypes: {
     moreTables: React.PropTypes.object
     },

     getDefaultProps() {
     return {
     moreTables: List()
     };
     },
   */

  getStateFromStores() {
    const tableId  = tableBrowserStore.getCurrentTableId();
    const localState = tableBrowserStore.getLocalState(tableId);

    const isLoading = tablesStore.getIsLoading();
    const tables = tablesStore.getAll() || Map();
    const table = tables.get(tableId, Map());

    return {
      moreTables: List(), // context tables TBA
      tableId: tableId,
      table: table,
      isLoading: isLoading,
      localState: localState
    };
    // return this.prepareStateFromProps({tableId: this.getTableId()});
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
      this.resetTableEvents();
      this.loadAll();
    }
  },

  getTableId() {
    // return (this.state && this.state.tableId) ? this.state.tableId : this.getRouteTableId();
    return this.state.tableId;
  },

  componentDidMount() {
    setTimeout(() => storageActions.loadTables().then(this.onShow));
  },

  componentWilUnmount() {
    this.stopEventService();
    this.stopPollingDataProfilerJob();
  },

  pollDataProfilerJob() {
    const schedule = later.parse.recur().every(5).second();
    this.stopPollingDataProfilerJob();
    this.timeout = later.setInterval(this.getDataProfilerJobResult, schedule);
  },

  getDataProfilerJobResult() {
    const jobId = this.getLocalState(['profilerData', 'runningJob', 'id']);
    getDataProfilerJob(jobId).then( (runningJob) => {
      if (runningJob.isFinished) {
        this.stopPollingDataProfilerJob();
        this.findEnhancedJob();
      }
    });
  },

  stopPollingDataProfilerJob() {
    if (this.timeout) {
      this.timeout.clear();
    }
  },

  findEnhancedJob() {
    // do the enhanced analysis only for redshift tables
    if (!this.isRedshift()) {
      return;
    }
    this.setLocalState({loadingProfilerData: true});
    const tableId = this.getTableId();
    const component = this;
    fetchProfilerData(tableId).then( (result) =>{
      component.setState({
        profilerData: Immutable.fromJS(result),
        loadingProfilerData: false
      });
      if (result && result.runningJob) {
        this.pollDataProfilerJob();
      }
    });
  },

  render() {
    return (
      <span key="mainspan">
        {this.renderModal()}
      </span>
    );
  },

  renderTooltip() {
    if (this.state.isLoading) {
      return 'Loading';
    }

    const table = this.state.table;
    if (!this.tableExists()) {
      return 'Table does not exist.';
    }
    if (table.get('lastChangeDate') === null) {
      return 'Table exists, but was never imported.';
    }
    return (
      <span key="tooltipinfo">
        <div>
          {moment(table.get('lastChangeDate')).fromNow()}
        </div>
        <div>
          {filesize(table.get('dataSizeBytes', 'N/A'))}
        </div>
        <div>
          {table.get('rowsCount', 'N/A')} rows
        </div>
      </span>
    );
  },

  renderModal() {
    return (
      <TableLinkModalDialog
        moreTables={this.state.moreTables.toArray()}
        tableId={this.getTableId()}
        reload={this.reload}
        tableExists={this.tableExists()}
        omitFetches={this.getLocalState('omitFetches')}
        omitExports={this.getLocalState('omitExports')}
        onHideFn={this.onHide}
        isLoading={this.isLoading()}
        table={this.state.table}
        dataPreview={this.getLocalState('dataPreview')}
        dataPreviewError={this.getLocalState('dataPreviewError')}
        onOmitExportsFn={this.onOmitExports}
        onOmitFetchesFn={this.onOmitFetches}
        events={this.getLocalState('events')}
        enhancedAnalysis={this.getLocalState('profilerData')}
        onRunAnalysis={this.onRunEnhancedAnalysis}
        isCallingRunAnalysis={this.getLocalState('isCallingRunAnalysis')}
        loadingProfilerData={this.getLocalState('loadingProfilerData')}
        isRedshift={this.isRedshift()}
        onChangeTable={this.changeTable}
        filterIOEvents={this.getLocalState('filterIOEvents')}
        onFilterIOEvents={this.onFilterIOEvents}
        onShowEventDetail={(eventId) => this.setLocalState({detailEventId: eventId})}
        detailEventId={this.getLocalState('detailEventId')}
      />
    );
  },

  onRunEnhancedAnalysis() {
    this.setLocalState({isCallingRunAnalysis: true});
    startDataProfilerJob(this.getTableId())
      .then( () => {
        this.findEnhancedJob().then(() => this.setLocalState({isCallingRunAnalysis: false}));
      })
      .catch(() => this.setLocalState({isCallingRunAnalysis: false}));
  },

  onOmitExports(e) {
    const checked = e.target.checked;
    this.setLocalState({omitExports: checked}, () => {
      const q = this.prepareEventQuery();
      this.getLocalState('eventService').setQuery(q);
      this.getLocalState('eventService').load();
    });
  },

  onOmitFetches(e) {
    const checked = e.target.checked;
    this.setLocalState({omitFetches: checked}, () => {
      const q = this.prepareEventQuery();
      this.getLocalState('eventService').setQuery(q);
      this.getLocalState('eventService').load();
    });
  },

  onFilterIOEvents(e) {
    const checked = e.target.checked;
    this.setLocalState({filterIOEvents: checked}, () => {
      const q = this.prepareEventQuery();
      this.getLocalState('eventService').setQuery(q);
      this.getLocalState('eventService').load();
    });
  },

  resetTableEvents() {
    const q = this.prepareEventQuery();
    this.stopEventService();
    this.getLocalState('eventService').reset();
    this.getLocalState('eventService').setQuery(q);
  },

  prepareEventQuery() {
    const options = {
      omitExports: this.getLocalState('omitExports'),
      omitFetches: this.getLocalState('omitFetches'),
      filterIOEvents: this.getLocalState('filterIOEvents')
    };
    // const options = initState || currentState;
    return utils.createventQueryString(options, this.getTableId());
  },

  isLoading() {
    return this.state.isLoading || this.getLocalState('loadingPreview') || this.getLocalState('eventService').getIsLoading();
  },

  redirectBack() {
    const routerState = RoutesStore.getRouterState();
    const currentPath = routerState.get('path') || '';
    const parts = currentPath.split(`/${PATH_PREFIX}/`);
    const backPath = parts ? parts[0] : '/';
    RoutesStore.getRouter().transitionTo(backPath || '/');
  },

  onHide() {
    this.stopPollingDataProfilerJob();
    this.stopEventService();
    this.redirectBack();
  },

  reload() {
    Promise.props( {
      'loadAllTablesFore': storageActions.loadTablesForce().then(() => this.findEnhancedJob()),
      'exportData': this.exportDataSample(),
      'loadEvents': this.getLocalState('eventService').load()
    });
  },

  loadAll() {
    this.exportDataSample();
    this.startEventService();
    // this.setState({show: true});
    this.findEnhancedJob();
  },

  onShow() {
    if (this.state.isLoading) {
      storageApi.getTables().then(() => this.loadAll());
    } else {
      this.loadAll();
    }
  },

  startEventService() {
    this.getLocalState('eventService').addChangeListener(this.handleEventsChange);
    this.getLocalState('eventService').load();
  },

  stopEventService() {
    this.getLocalState('eventService').stopAutoReload();
    this.getLocalState('eventService').removeChangeListener(this.handleEventsChange);
  },

  handleEventsChange() {
    const events = this.getLocalState('eventService').getEvents();
    this.setLocalState({events: events});
  },

  exportDataSample() {
    if (!this.tableExists()) {
      return false;
    }

    this.setLocalState({
      loadingPreview: true
    });
    const component = this;
    return storageApi
      .tableDataPreview(this.getTableId(), {limit: 10})
      .then( (csv) => {
        component.setLocalState({
          loadingPreview: false,
          dataPreview: Immutable.fromJS(csv)
        });
      })
      .catch((error) => {
        let dataPreviewError = null;
        if (error.response && error.response.body) {
          if (error.response.body.code === 'storage.maxNumberOfColumnsExceed') {
            dataPreviewError = 'Data sample cannot be displayed. Too many columns.';
          } else {
            dataPreviewError = error.response.body.message;
          }
        } else {
          throw new Error(JSON.stringify(error));
        }
        component.setLocalState({
          loadingPreview: false,
          dataPreviewError: dataPreviewError
        });
      });
  },

  tableExists() {
    return !_.isEmpty(this.state.table.toJS());
  },

  isRedshift() {
    return this.tableExists() && this.state.table.getIn(['bucket', 'backend']) === 'redshift';
  }

});
