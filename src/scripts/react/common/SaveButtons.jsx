/*
   Edit buttons
   When editing Save and Cancel buttons are shown. These buttons are disabled and loader is shown when saving.
 */
import React from 'react';

import {Loader} from '@keboola/indigo-ui';
import {Button} from 'react-bootstrap';

import SaveButtonsModal from './SaveButtonsModal';

// css
require('./SaveButtons.less');

export default React.createClass({

  propTypes: {
    isSaving: React.PropTypes.bool.isRequired,
    isChanged: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    saveStyle: React.PropTypes.string,
    onReset: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    showModal: React.PropTypes.bool,
    modalTitle: React.PropTypes.string,
    modalBody: React.PropTypes.any
  },

  getDefaultProps() {
    return {
      saveStyle: 'success',
      disabled: false,
      showModal: true,
      modalTitle: '',
      modalBody: (<span />)
    };
  },

  getInitialState() {
    return {
      modalOpen: false
    };
  },

  render() {
    return (
      <div className="kbc-buttons kbc-save-buttons">
        {this.resetButton()}
        {this.modal()}
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

  onSaveButtonClick() {
    if (!this.props.showModal) {
      return this.props.onSave();
    } else {
      this.setState({modalOpen: true});
    }
  },

  modal() {
    const component = this;
    return (
      <SaveButtonsModal
        title={this.props.modalTitle}
        body={this.props.modalBody}
        show={this.state.modalOpen}
        onSave={this.props.onSave}
        onHide={function() {
          return component.setState({modalOpen: false});
        }}
      />
    );
  },

  saveButton() {
    return (
      <Button
        className="save-button"
        bsStyle={this.props.saveStyle}
        disabled={this.saveButtonDisabled()}
        onClick={this.onSaveButtonClick}>
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
