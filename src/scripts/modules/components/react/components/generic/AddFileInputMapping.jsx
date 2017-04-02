import React from 'react';
import FileInputMappingModal from './FileInputMappingModal';
import actionCreators from '../../../InstalledComponentsActionCreators';

export default React.createClass({
  propTypes: {
    mapping: React.PropTypes.object.isRequired,
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired
  },

  render() {
    return React.createElement(FileInputMappingModal, {
      mode: 'create',
      mapping: this.props.mapping,
      onChange: this.handleChange,
      onCancel: this.handleCancel,
      onSave: this.handleSave
    });
  },

  /* eslint camelcase: 0 */
  handleChange(newMapping) {
    actionCreators.changeEditingMapping(this.props.componentId,
      this.props.configId,
      'input',
      'files',
      'new-mapping',
      newMapping
    );
  },

  handleCancel() {
    actionCreators.cancelEditingMapping(this.props.componentId,
      this.props.configId,
      'input',
      'files',
      'new-mapping'
    );
  },

  handleSave() {
    // returns promise
    return actionCreators.saveEditingMapping(this.props.componentId,
      this.props.configId,
      'input',
      'files',
      'new-mapping',
      'Add input file'
    );
  }

});
