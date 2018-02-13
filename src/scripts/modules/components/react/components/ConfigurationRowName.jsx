import React from 'react';
import InlineEditTextInput from '../../../../react/common/InlineEditTextInput';
import ConfigurationRowEditField from './ConfigurationRowEditField';

module.exports = React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    rowId: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      placeholder: 'My Configuration'
    };
  },
  render: function() {
    return React.createElement(ConfigurationRowEditField, {
      componentId: this.props.componentId,
      configId: this.props.configId,
      rowId: this.props.rowId,
      fieldName: 'name',
      editElement: InlineEditTextInput,
      placeholder: this.props.placeholder,
      tooltipPlacement: 'bottom'
    });
  }
});
