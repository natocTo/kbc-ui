import React, {PropTypes} from 'react';
import Edit from './RuntimeConfigurationEdit';

/* global require */
require('codemirror/mode/javascript/javascript');

export default React.createClass({
  propTypes: {
    data: PropTypes.object.isRequired,
    isChanged: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    headerText: PropTypes.string,
    saveLabel: PropTypes.string
  },

  getDefaultProps() {
    return {
      headerText: 'Runtime',
      saveLabel: 'Save configuration'
    };
  },

  render() {
    return (
      <div>
        <h2>{this.props.headerText}</h2>
        {this.renderEditor()}
      </div>
    );
  },

  renderEditor() {
    return (
      <Edit
        data={this.props.data}
        isSaving={this.props.isSaving}
        isChanged={this.props.isChanged}
        onSave={this.props.onEditSubmit}
        onChange={this.props.onEditChange}
        onCancel={this.props.onEditCancel}
        saveLabel={this.props.saveLabel}
      />
    );
  }

});
