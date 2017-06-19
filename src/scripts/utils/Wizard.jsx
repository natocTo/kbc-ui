import React from 'react';
import WizardModal from './WizardModal';


module.exports = React.createClass({
  displayName: 'Wizard',

  render: function() {
    return (
        <WizardModal show={true} onHide={this.hideWizardModal} position="aside" step={1}>aaa</WizardModal>
    );
  },
  showWizardModal: function() {
    this.setState({showWizardModal: true});
  },
  hideWizardModal: function() {
    this.setState({showWizardModal: false});
  }
});

