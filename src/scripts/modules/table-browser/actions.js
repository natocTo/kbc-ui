import {ActionTypes} from './store';
import dispatcher from '../../Dispatcher';
function setLocalState(tableId, localState) {
  dispatcher.handleViewAction({
    type: ActionTypes.TABLEBROWSER_SET_LOCALSTATE,
    tableId: tableId,
    localState: localState
  });
}

function setCurrentTableId(tableId, localState) {
  dispatcher.handleViewAction({
    type: ActionTypes.TABLEBROWSER_SET_CURRENT_TABLEID,
    tableId: tableId,
    localState: localState
  });
}

export default {
  setLocalState: setLocalState,
  setCurrentTableId: setCurrentTableId
};