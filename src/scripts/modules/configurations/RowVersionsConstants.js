import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  ActionTypes: keyMirror({

    ROW_VERSIONS_LOAD_START: null,
    ROW_VERSIONS_LOAD_SUCCESS: null,
    ROW_VERSIONS_LOAD_ERROR: null,

    ROW_VERSIONS_ROLLBACK_START: null,
    ROW_VERSIONS_ROLLBACK_SUCCESS: null,
    ROW_VERSIONS_ROLLBACK_ERROR: null,

    ROW_VERSIONS_NEW_NAME_CHANGE: null,

    ROW_VERSIONS_FILTER_CHANGE: null,

    ROW_VERSIONS_PENDING_START: null,
    ROW_VERSIONS_PENDING_STOP: null,

    ROW_VERSIONS_CONFIG_LOAD_SUCCESS: null,
    ROW_VERSIONS_CONFIG_LOAD_START: null,
    ROW_VERSIONS_CONFIG_LOAD_ERROR: null,
    ROW_VERSIONS_MULTI_PENDING_START: null,
    ROW_VERSIONS_MULTI_PENDING_STOP: null
  })
};
