/*
   Edit buttons
   When editing Save and Cancel buttons are shown. These buttons are disabled and loader is shown when saving.
   Edit butotn is shown when editing mode is disabled.
 */
import React from 'react';

import {Loader} from '@keboola/indigo-ui';
import {Button} from 'react-bootstrap';

export default React.createClass({

  propTypes: {
    isSaving: React.PropTypes.bool.isRequired,
    isDisabled: React.PropTypes.bool,
    cancelLabel: React.PropTypes.string,
    saveLabel: React.PropTypes.string,
    saveStyle: React.PropTypes.string,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    placement: React.PropTypes.oneOf(['left', 'right']),
    showCancel: React.PropTypes.bool,
    showSave: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      saveLabel: 'Save',
      saveStyle: 'success',
      cancelLabel: 'Cancel',
      placement: 'right',
      isDisabled: false,
      showSave: true,
      showCancel: true
    };
  },

  render() {
    if (this.props.placement === 'left') {
      return (
        <div className={'kbc-buttons ' + this.props.className}>
          {this._saveButton()}
          {this._cancelButton()}
          {!this.props.showCancel && ' '}
          {this._loader()}
        </div>
      );
    } else {
      return (
        <div className={'kbc-buttons ' + this.props.className}>
          {this._loader()}
          {!this.props.showCancel && ' '}
          {this._cancelButton()}
          {this._saveButton()}
        </div>
      );
    }
  },

  _loader() {
    if (this.props.isSaving) return (<Loader />);
    return null;
  },

  _saveButton() {
    if (this.props.showSave) {
      return (
        <Button
          bsStyle={this.props.saveStyle}
          disabled={this.props.isSaving || this.props.isDisabled}
          onClick={this.props.onSave}>
          {this.props.saveLabel}
        </Button>
      );
    } else return null;
  },

  _cancelButton() {
    if (this.props.showCancel) {
      return (
        <Button
          bsStyle="link"
          disabled={this.props.isSaving}
          onClick={this.props.onCancel}>
          {this.props.cancelLabel}
        </Button>
      );
    } else return null;
  }
});
