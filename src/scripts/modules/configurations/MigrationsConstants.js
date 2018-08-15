import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  ActionTypes: keyMirror({
    LEGACY_UI_MIGRATION_START: null,
    LEGACY_UI_MIGRATION_SUCCESS: null,
    LEGACY_UI_MIGRATION_ERROR: null
  })
};
