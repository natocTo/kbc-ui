import React from 'react';
import InlineEditTextArea from '../../../react/common/InlineEditArea';
import ConfigurationRowEditField from '../../../modules/components/react/components/ConfigurationRowEditField';

export default React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    rowId: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      placeholder: 'Description'
    };
  },
  render: function() {
    return React.createElement(ConfigurationRowEditField, {
      componentId: this.props.componentId,
      configId: this.props.configId,
      rowId: this.props.rowId,
      fieldName: 'description',
      editElement: InlineEditTextArea,
      placeholder: this.props.placeholder,
      tooltipPlacement: 'bottom'
    });
  }
});
