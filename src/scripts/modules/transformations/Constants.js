import keyMirror from 'fbjs/lib/keyMirror';

export const ActionTypes = keyMirror({
  TRANSFORMATION_BUCKET_CREATE: null,
  TRANSFORMATION_BUCKET_CREATE_SUCCESS: null,
  TRANSFORMATION_BUCKET_CREATE_ERROR: null,

  TRANSFORMATION_CREATE_SUCCESS: null,

  TRANSFORMATION_BUCKET_DELETE: null,
  TRANSFORMATION_BUCKET_DELETE_SUCCESS: null,
  TRANSFORMATION_BUCKET_DELETE_ERROR: null,

  TRANSFORMATION_DELETE: null,
  TRANSFORMATION_DELETE_SUCCESS: null,
  TRANSFORMATION_DELETE_ERROR: null,

  TRANSFORMATION_OVERVIEW_LOAD: null,
  TRANSFORMATION_OVERVIEW_LOAD_SUCCESS: null,
  TRANSFORMATION_OVERVIEW_LOAD_ERROR: null,
  TRANSFORMATION_OVERVIEW_SHOW_DISABLED: null,

  TRANSFORMATION_INPUT_MAPPING_OPEN_TOGGLE: null,
  TRANSFORMATION_OUTPUT_MAPPING_OPEN_TOGGLE: null,

  TRANSFORMATION_EDIT_START: null,
  TRANSFORMATION_EDIT_CANCEL: null,
  TRANSFORMATION_EDIT_SAVE_START: null,
  TRANSFORMATION_EDIT_SAVE_SUCCESS: null,
  TRANSFORMATION_EDIT_SAVE_ERROR: null,
  TRANSFORMATION_EDIT_CHANGE: null,

  TRANSFORMATION_EDIT_INPUT_MAPPING_OPEN_TOGGLE: null,
  TRANSFORMATION_EDIT_INPUT_MAPPING_ADD: null,
  TRANSFORMATION_EDIT_INPUT_MAPPING_DELETE: null,

  TRANSFORMATION_EDIT_OUTPUT_MAPPING_OPEN_TOGGLE: null,
  TRANSFORMATION_EDIT_OUTPUT_MAPPING_ADD: null,
  TRANSFORMATION_EDIT_OUTPUT_MAPPING_DELETE: null,

  TRANSFORMATION_BUCKETS_FILTER_CHANGE: null,
  TRANSFORMATION_BUCKETS_TOGGLE: null,

  TRANSFORMATION_START_EDIT_FIELD: null,
  TRANSFORMATION_UPDATE_EDITING_FIELD: null,
  TRANSFORMATION_CANCEL_EDITING_FIELD: null,

  DELETED_TRANSFORMATION_BUCKET_RESTORE: null,
  DELETED_TRANSFORMATION_BUCKET_RESTORE_SUCCESS: null,
  DELETED_TRANSFORMATION_BUCKET_RESTORE_ERROR: null,

  TRANSFORMATION_UPDATE_PARSE_QUERIES: null,
  TRANSFORMATION_UPDATE_PARSE_QUERIES_START: null,
  TRANSFORMATION_UPDATE_PARSE_QUERIES_SUCCESS: null,
  TRANSFORMATION_UPDATE_PARSE_QUERIES_ERROR: null
});