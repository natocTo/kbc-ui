import _ from 'underscore';
import {List, Map} from 'immutable';
import { factory as EventsServiceFactory} from '../sapi-events/EventsService';

const  IMPORT_EXPORT_EVENTS = ['tableImportStarted', 'tableImportDone', 'tableImportError', 'tableExported'];

export const createEventQueryString = (options, tableId) => {
  const {omitExports, omitFetches, filterIOEvents} = options;
  const omitFetchesEvent = omitFetches ? ['tableDataPreview', 'tableDetail'] : [];
  const omitExportsEvent = omitExports ? ['tableExported'] : [];
  let omitsQuery = omitFetchesEvent.concat(omitExportsEvent).map((ev) => `NOT event:storage.${ev}`);
  if (filterIOEvents) {
    omitsQuery =  IMPORT_EXPORT_EVENTS.map((ev) => `event:storage.${ev}`);
  }
  const objectIdQuery = `objectId:${tableId}`;
  return _.isEmpty(omitsQuery) ? objectIdQuery : `((${omitsQuery.join(' OR ')}) AND ${objectIdQuery})`;
};

export const initLocalState = (tableId) => {
  const omitFetches = true, omitExports = false, filterIOEvents = false;
  const es = EventsServiceFactory({limit: 10});
  const options = {omitFetches, omitExports, filterIOEvents};
  const eventQuery = createEventQueryString(options, tableId);
  es.setQuery(eventQuery);
  return Map({
    eventService: es,
    events: List(),
    dataPreview: List(),
    dataPreviewError: null,
    loadingPreview: false,
    loadingProfilerData: false,
    omitFetches: omitFetches,
    omitExports: omitExports,
    filterIOEvents: filterIOEvents,
    isCallingRunAnalysis: false,
    detailEventId: null,
    profilerData: Map()
  });
};
