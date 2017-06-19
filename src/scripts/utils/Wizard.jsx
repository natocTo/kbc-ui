import React from 'react';
// import {Modal, Button, Link} from 'react-bootstrap';
// import {Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Button, Link} from 'react-bootstrap';
import WizardModal from './WizardModal';


module.exports = React.createClass({
  displayName: 'Wizard',

  render: function() {
    return (
        <WizardModal show={true} onHide={this.hideWizardModal} collapsed="aside" step={1}>aaa</WizardModal>
    );
  },
  showWizardModal: function() {
    this.setState({showWizardModal: true});
  },
  hideWizardModal: function() {
    this.setState({showWizardModal: false});
  }
});

