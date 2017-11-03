import storeProvisioning from './storeProvisioning';
import tableBrowserActions from './flux/actions';
// import storageActions from '../components/StorageActionCreators';
import storageApi from '../components/StorageApi';
import {startDataProfilerJob, getDataProfilerJob, fetchProfilerData} from './react/components/DataProfilerUtils';
import {fromJS} from 'immutable';
import later from 'later';
import {createEventQueryString} from './utils';

function runExportDataSample(tableId, onSucceed, onFail) {
  return storageApi
  .tableDataPreview(tableId, {limit: 10})
  .then(onSucceed)
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
    return onFail(dataPreviewError);
  });
}

export default function(tableId) {
  const getStore = () => storeProvisioning(tableId);
  const getLocalState = (path) => getStore().getLocalState(path);
  const getEventService = () => getStore().eventService;
  const setLocalStateByPath = (path, value) => {
    const newLocalState = getLocalState().setIn([].concat(path), value);
    return tableBrowserActions.setLocalState(tableId, newLocalState);
  };
  const setLocalState = (newStateObject) => {
    const keysToUpdate = Object.keys(newStateObject);
    const newLocalState = keysToUpdate.reduce(
      (memo, key) => memo.set(key, newStateObject[key]),
      getLocalState()
    );
    tableBrowserActions.setLocalState(tableId, newLocalState);
  };
  const handleEventsChange = () => {
    const events = getEventService().getEvents();
    setLocalState({events: events});
  };


  const findEnhancedJob = () => {
    // do the enhanced analysis only for redshift tables
    if (!getStore().isRedshift()) {
      return;
    }
    setLocalState({loadingProfilerData: true});
    fetchProfilerData(tableId).then( (result) =>{
      setLocalState({
        profilerData: fromJS(result),
        loadingProfilerData: false
      });
      if (result && result.runningJob) {
        pollDataProfilerJob();
      }
    });
  };

  const stopPollingDataProfilerJob = () => {
    if (getLocalState('timeout')) {
      getLocalState('timeout').clear();
    }
  };

  const getDataProfilerJobResult = () => {
    const jobId = getLocalState(['profilerData', 'runningJob', 'id']);
    getDataProfilerJob(jobId).then( (runningJob) => {
      if (runningJob.isFinished) {
        stopPollingDataProfilerJob();
        findEnhancedJob();
      }
    });
  };

  const pollDataProfilerJob = () => {
    const schedule = later.parse.recur().every(5).second();
    stopPollingDataProfilerJob();
    const timeout = later.setInterval(getDataProfilerJobResult, schedule);
    setLocalState('timeout', timeout);
  };

  const onRunEnhancedAnalysis = () => {
    setLocalState({isCallingRunAnalysis: true});
    startDataProfilerJob(tableId)
    .then( () => {
      findEnhancedJob().then(() => setLocalState({isCallingRunAnalysis: false}));
    })
    .catch(() => setLocalState({isCallingRunAnalysis: false}));
  };

  const exportDataSample = () => {
    if (!getStore().tableExists()) return false;
    const onSucceed = (csv) =>
    setLocalState({
      loadingPreview: false,
      dataPreview: fromJS(csv)
    });

    const onFail = (dataPreviewError) => setLocalState({
      loadingPreview: false,
      dataPreviewError: dataPreviewError
    });

    setLocalState({
      loadingPreview: true
    });
    return runExportDataSample(tableId, onSucceed, onFail);
  };

  const startEventService = () => {
    getEventService().addChangeListener(handleEventsChange);
    getEventService().load();
  };

  const stopEventService = () => {
    getEventService().stopAutoReload();
    getEventService().removeChangeListener(handleEventsChange);
  };

  const prepareEventQuery = () => {
    const options = {
      omitExports: getLocalState('omitExports'),
      omitFetches: getLocalState('omitFetches'),
      filterIOEvents: getLocalState('filterIOEvents')
    };
    return createEventQueryString(options, tableId);
  };

  const setEventsFilter = (filterName) => {
    return (e) => {
      setLocalStateByPath(filterName, e.target.checked);
      const q = prepareEventQuery();
      getEventService().setQuery(q);
      getEventService().load();
    };
  };

  const resetTableEvents = () => {
    const q = prepareEventQuery();
    stopEventService();
    getLocalState('eventService').reset();
    getLocalState('eventService').setQuery(q);
  };

  return {
    startEventService: startEventService,
    stopEventService: stopEventService,
    resetTableEvents: resetTableEvents,

    exportDataSample: exportDataSample,

    stopPollingDataProfilerJob: stopPollingDataProfilerJob,
    findEnhancedJob: findEnhancedJob,
    onRunEnhancedAnalysis: onRunEnhancedAnalysis,
    setEventsFilter: setEventsFilter,

    loadAll: () => {
      exportDataSample();
      startEventService();
      findEnhancedJob();
    }
  };
}