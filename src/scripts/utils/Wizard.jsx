import React from 'react';
import WizardModal from './WizardModal';
import {Button} from 'react-bootstrap';


module.exports = React.createClass({
  displayName: 'Wizard',

  getInitialState() {
    return {
      showModal: false
    };
  },
  render: function() {
    return (
      <span>
        <WizardModal show={this.state.showModal} onHide={this.hideWizardModal} position="aside" step={1}>aaa</WizardModal>
        <Button className="btn btn-link" onClick={this.openModal}>open</Button>
      </span>
    );
  },
  showWizardModal: function() {
    this.setState({showWizardModal: true});
  },
  hideWizardModal: function() {
    this.setState({showModal: false});
  },
  openModal() {
    this.setState({ showModal: true });
  }
});

