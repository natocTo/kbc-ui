import React from 'react';
import TableOutputMappingModal from './TableOutputMappingModal';
import actionCreators from '../../../InstalledComponentsActionCreators';

export default React.createClass({
  propTypes: {
    tables: React.PropTypes.object.isRequired,
    buckets: React.PropTypes.object.isRequired,
    mapping: React.PropTypes.object.isRequired,
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired
  },

  render() {
    return React.createElement(TableOutputMappingModal, {
      mode: 'create',
      mapping: this.props.mapping,
      tables: this.props.tables,
      buckets: this.props.buckets,
      onChange: this.handleChange,
      onCancel: this.handleCancel,
      onSave: this.handleSave
    });
  },

  /* eslint camelcase: 0 */
  handleChange(newMapping) {
    actionCreators.changeEditingMapping(this.props.componentId,
      this.props.configId,
      'output',
      'tables',
      'new-mapping',
      newMapping
    );
  },

  handleCancel() {
    actionCreators.cancelEditingMapping(this.props.componentId,
      this.props.configId,
      'output',
      'tables',
      'new-mapping'
    );
  },

  handleSave() {
    const newTableId = this.props.mapping.get('destination');
    // returns promise
    return actionCreators.saveEditingMapping(this.props.componentId,
      this.props.configId,
      'output',
      'tables',
      'new-mapping',
      `Add output table ${newTableId}`
    );
  }

});
