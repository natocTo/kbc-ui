/*
   Edit buttons
   When editing Save and Cancel buttons are shown. These buttons are disabled and loader is shown when saving.
 */
import React from 'react';

import {Loader} from 'kbc-react-components';
import {Button} from 'react-bootstrap';

// css
require('./SaveButtons.less');

export default React.createClass({

  propTypes: {
    isSaving: React.PropTypes.bool.isRequired,
    isChanged: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    saveStyle: React.PropTypes.string,
    onReset: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      saveStyle: 'success',
      disabled: false
    };
  },

  render() {
    return (
      <div className="kbc-buttons kbc-save-buttons">
        {this.resetButton()}
        {this.saveButton()}
      </div>
    );
  },

  saveButtonText() {
    if (this.props.isSaving) {
      return (<Loader />);
    }
    if (this.props.isChanged) {
      return 'Save';
    }
    return 'Saved';
  },

  saveButtonDisabled() {
    if (this.props.disabled) {
      return true;
    }
    if (this.props.isSaving) {
      return true;
    }
    if (this.props.isChanged) {
      return false;
    }
    return true;
  },

  saveButton() {
    return (
      <Button
        className="save-button"
        bsStyle={this.props.saveStyle}
        disabled={this.saveButtonDisabled()}
        onClick={this.props.onSave}>
        {this.saveButtonText()}
      </Button>
    );
  },

  resetButton() {
    if (!this.props.isChanged) {
      return null;
    }
    if (this.props.isSaving) {
      return null;
    }
    return (
      <Button
        bsStyle="link"
        onClick={this.props.onReset}>
        Reset
      </Button>
    );
  }
});
