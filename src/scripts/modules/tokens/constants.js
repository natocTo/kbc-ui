import keyMirror from 'fbjs/lib/keyMirror';

export default {
  ActionTypes: keyMirror({
    STORAGE_TOKENS_LOAD: null,
    STORAGE_TOKENS_LOAD_SUCCESS: null,
    STORAGE_TOKENS_LOAD_ERROR: null,
    STORAGE_TOKEN_CREATE: null,
    STORAGE_TOKEN_CREATE_SUCCESS: null,
    STORAGE_TOKEN_CREATE_ERROR: null,
    STORAGE_TOKEN_DELETE: null,
    STORAGE_TOKEN_DELETE_SUCCESS: null
  })
};
