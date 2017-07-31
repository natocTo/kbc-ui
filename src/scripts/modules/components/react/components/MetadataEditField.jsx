
import React, {PropTypes} from 'react';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import MetadataStore from '../../stores/MetadataStore';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';
import MetadataActionCreators from '../../MetadataActionCreators';

require('./MetadataEditField.less');

export default React.createClass({

  displayName: 'MetadataEditField',

  mixins: [createStoreMixin(MetadataStore), immutableMixin],

  propTypes: {
    objectType: PropTypes.oneOf(['bucket', 'table', 'column']).isRequired,
    objectId: PropTypes.string.isRequired,
    metadataKey: PropTypes.string.isRequired,
    editElement: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    tooltipPlacement: PropTypes.string
  },

  getDefaultProps: function() {
    return {
      placeholder: 'Describe this ...',
      tooltipPlacement: 'top'
    };
  },

  componentsWillReceiveProps: function(nextProps) {
    this.setState(this.getState(nextProps));
  },

  getStateFromStores: function() {
    return this.getState(this.props);
  },

  getState: function(props) {
    return {
      value: MetadataStore.getMetadataValue(props.objectType, props.objectId, 'user', props.metadataKey),
      editValue: MetadataStore.getEditingMetadataValue(props.objectType, props.objectId, props.metadataKey),
      isEditing: MetadataStore.isEditingMetadata(props.objectType, props.objectId, props.metadataKey),
      isSaving: MetadataStore.isSavingMetadata(props.objectType, props.objectId, props.metadataKey)
    };
  },

  _handleEditStart: function() {
    MetadataActionCreators.startMetadataEdit(
      this.props.objectType,
      this.props.objectId,
      this.props.metadataKey
    );
  },

  _handleEditCancel: function() {
    MetadataActionCreators.cancelMetadataEdit(
      this.props.objectType,
      this.props.objectId,
      this.props.metadataKey
    );
  },

  _handleEditChange: function(newValue) {
    MetadataActionCreators.updateEditingMetadata(
      this.props.objectType,
      this.props.objectId,
      this.props.metadataKey,
      newValue
    );
  },

  _handleEditSubmit: function() {
    MetadataActionCreators.saveMetadata(
      this.props.objectType,
      this.props.objectId,
      this.props.metadataKey
    );
  },

  render() {
    return (
        React.createElement(this.props.editElement, {
          text: (this.state.isEditing) ? this.state.editValue : this.state.value,
          placeholder: this.props.placeholder,
          tooltipPlacement: this.props.tooltipPlacement,
          isSaving: this.state.isSaving,
          isEditing: this.state.isEditing,
          isValid: this.state.isValid,
          onEditStart: this._handleEditStart,
          onEditChange: this._handleEditChange,
          onEditSubmit: this._handleEditSubmit,
          onEditCancel: this._handleEditCancel
        })
    );
  }
});
