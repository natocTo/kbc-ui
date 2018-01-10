import React from 'react';

import {Loader} from 'kbc-react-components';
import {Button} from 'react-bootstrap';

// css
require('./ProvisioningButton.less');

export default React.createClass({

  propTypes: {
    isSaving: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    onGenerate: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      disabled: false
    };
  },

  render() {
    return (
      <div className="kbc-buttons kbc-save-buttons">
        {this.saveButton()}
      </div>
    );
  },

  buttonText() {
    if (this.props.isSaving) {
      return (<Loader />);
    }
    return 'Get Credentials';
  },

  isButtonDisabled() {
    if (this.props.disabled) {
      return true;
    }
    if (this.props.isSaving) {
      return true;
    }
    return false;
  },

  saveButton() {
    return (
      <Button
        className="generate-button"
        bsStyle="success"
        disabled={this.isButtonDisabled()}
        onClick={this.props.onGenerate}>
        {this.buttonText()}
      </Button>
    );
  }
});
