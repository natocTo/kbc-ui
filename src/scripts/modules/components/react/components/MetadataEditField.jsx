
import React, {PropTypes, DOM} from 'react';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import StorageTablesStore from '../../stores/StorageTablesStore';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';

export default React.createClass({

  displayName: 'MetadataEditField',

  mixins: [createStoreMixin(StorageTablesStore), immutableMixin],

  propTypes: {
    objectType: React.PropTypes.oneOf(['bucket', 'table', 'column']).isRequired,
    objectId: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    editElement: React.PropTypes.func.isRequired
    placeholder: React.PropTypes.string,
    tooltipPlacement: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      placeholder: 'Describe this ...',
      tooltipPlacement: 'top'
    }
  },

  componentsWillReceiveProps: function(nextProps) {
    return @setState(@getState(nextProps));
  },

  getStateFromStores: function() {
    return @getState(@props);
  },

  getState: function(props) {
    MetadataStore.get

    return {
      value: StorageTablesStore.getTableMetadata(props.objectId)
      isEditing: StorageTablesStore.isEditingMetadata(props.objectType, props.objectId, props.fieldName)
    };
    /*
    value: InstalledComponentsStore.getConfig(props.componentId, props.configId).get props.fieldName
    editValue: InstalledComponentsStore.getEditingConfig props.componentId, props.configId, props.fieldName
    isEditing: InstalledComponentsStore.isEditingConfig props.componentId, props.configId, props.fieldName
    isSaving: InstalledComponentsStore.isSavingConfig props.componentId, props.configId, props.fieldName
    isValid: InstalledComponentsStore.isValidEditingConfig props.componentId, props.configId, props.fieldName
    */
  },

  _handleEditStart: function() {
    StorageActionCreators.startMetadataEdit(@props.objectType, @props.objectId, @props.fieldName);
  },

  _handleEditCancel: function() {
    StorageActionCreators.cancelMetadataEdit(@props.objectType, @props.objectId, @props.fieldName);
  },

  _handleEditChange: function(newValue) {
    StorageActionCreators.updateEditingMetadata(@props.objectType, @props.objectId, @props.fieldName, newValue);
  },

  _handleEditSubmit: function() {
    StorageActionCreators.saveMetadata(@props.objectType, @props.objectId, @props.fieldName);
  },

  render() {
    React.createElement(@props.editElement, {
      text: (@state.isEditing) ? @state.editValue : @state.value,
      placeholder: @props.placeholder,
      tooltipPlacement: @props.tooltipPlacement,
      isSaving: @state.isSaving,
      isEditing: @state.isEditing,
      isValid: @state.isValid,
      onEditStart: @_handleEditStart,
      onEditChange: @_handleEditChange,
      onEditSubmit: @_handleEditSubmit
    });
  }
});
