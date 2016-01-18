keyMirror = require('react/lib/keyMirror')

module.exports =

  ActionTypes: keyMirror

    # Components
    COMPONENTS_SET_FILTER: null
    COMPONENTS_LOAD_SUCCESS: null

    # Installed components
    INSTALLED_COMPONENTS_LOAD: null
    INSTALLED_COMPONENTS_LOAD_SUCCESS: null
    INSTALLED_COMPONENTS_LOAD_ERROR: null

    # Installed components data
    INSTALLED_COMPONENTS_CONFIGDATA_LOAD: null
    INSTALLED_COMPONENTS_CONFIGDATA_LOAD_SUCCESS: null
    INSTALLED_COMPONENTS_CONFIGDATA_LOAD_ERROR: null
    INSTALLED_COMPONENTS_CONFIGDATA_SAVE_START: null
    INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS: null
    INSTALLED_COMPONENTS_CONFIGDATA_SAVE_ERROR: null
    INSTALLED_COMPONENTS_CONFIGDATA_EDIT_START: null
    INSTALLED_COMPONENTS_CONFIGDATA_EDIT_UPDATE: null
    INSTALLED_COMPONENTS_CONFIGDATA_EDIT_CANCEL: null

    INSTALLED_COMPONENTS_RAWCONFIGDATA_SAVE_START: null
    INSTALLED_COMPONENTS_RAWCONFIGDATA_SAVE_SUCCESS: null
    INSTALLED_COMPONENTS_RAWCONFIGDATA_SAVE_ERROR: null
    INSTALLED_COMPONENTS_RAWCONFIGDATA_EDIT_START: null
    INSTALLED_COMPONENTS_RAWCONFIGDATA_EDIT_UPDATE: null
    INSTALLED_COMPONENTS_RAWCONFIGDATA_EDIT_CANCEL: null

    INSTALLED_COMPONENTS_RAWCONFIGDATAPARAMETERS_SAVE_START: null
    INSTALLED_COMPONENTS_RAWCONFIGDATAPARAMETERS_SAVE_SUCCESS: null
    INSTALLED_COMPONENTS_RAWCONFIGDATAPARAMETERS_SAVE_ERROR: null
    INSTALLED_COMPONENTS_RAWCONFIGDATAPARAMETERS_EDIT_START: null
    INSTALLED_COMPONENTS_RAWCONFIGDATAPARAMETERS_EDIT_UPDATE: null
    INSTALLED_COMPONENTS_RAWCONFIGDATAPARAMETERS_EDIT_CANCEL: null

    INSTALLED_COMPONENTS_LOCAL_STATE_UPDATE: null

    INSTALLED_COMPONENTS_CONFIGURATION_EDIT_START: null
    INSTALLED_COMPONENTS_CONFIGURATION_EDIT_CANCEL: null
    INSTALLED_COMPONENTS_CONFIGURATION_EDIT_UPDATE: null

    INSTALLED_COMPONENTS_UPDATE_CONFIGURATION_START: null
    INSTALLED_COMPONENTS_UPDATE_CONFIGURATION_SUCCESS: null
    INSTALLED_COMPONENTS_UPDATE_CONFIGURATION_ERROR: null

    INSTALLED_COMPONENTS_DELETE_CONFIGURATION_START: null
    INSTALLED_COMPONENTS_DELETE_CONFIGURATION_SUCCESS: null
    INSTALLED_COMPONENTS_DELETE_CONFIGURATION_ERROR: null

    INSTALLED_COMPONENTS_CONFIGURATION_TOGGLE_MAPPING: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_EDITING_START: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_EDITING_CHANGE: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_EDITING_CANCEL: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_SAVE_START: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_SAVE_SUCCESS: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_SAVE_ERROR: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_DELETE_START: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_DELETE_SUCCESS: null
    INSTALLED_COMPONENTS_CONFIGURATION_MAPPING_DELETE_ERROR: null

    # New configurations
    COMPONENTS_NEW_CONFIGURATION_UPDATE: null
    COMPONENTS_NEW_CONFIGURATION_CANCEL: null
    COMPONENTS_NEW_CONFIGURATION_SAVE_START: null
    COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS: null
    COMPONENTS_NEW_CONFIGURATION_SAVE_ERROR: null

    # Storage
    STORAGE_BUCKETS_LOAD: null
    STORAGE_BUCKETS_LOAD_SUCCESS: null
    STORAGE_BUCKETS_LOAD_ERROR: null

    STORAGE_BUCKET_CREDENTIALS_DELETE_SUCCESS: null
    STORAGE_BUCKET_CREDENTIALS_DELETE: null
    STORAGE_BUCKET_CREDENTIALS_CREATE_SUCCESS: null
    STORAGE_BUCKET_CREDENTIALS_CREATE: null
    STORAGE_BUCKET_CREDENTIALS_LOAD_SUCCESS: null
    STORAGE_BUCKET_CREDENTIALS_LOAD: null


    STORAGE_TABLES_LOAD: null
    STORAGE_TABLES_LOAD_SUCCESS: null
    STORAGE_TABLES_LOAD_ERROR: null

    STORAGE_TOKENS_LOAD: null
    STORAGE_TOKENS_LOAD_SUCCESS: null
    STORAGE_TOKENS_LOAD_ERROR: null

    STORAGE_FILES_LOAD: null
    STORAGE_FILES_LOAD_SUCCESS: null
    STORAGE_FILES_LOAD_ERROR: null


  GoodDataWriterModes: keyMirror
    NEW: null
    EXISTING: null

  GoodDataWriterTokenTypes: keyMirror
    PRODUCTION: null
    DEVELOPER: null
    CUSTOM: null

  Routes:
    GENERIC_DETAIL_PREFIX: 'generic-detail-'
