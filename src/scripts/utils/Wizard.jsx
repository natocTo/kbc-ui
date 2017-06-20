import React from 'react';
import WizardModal from './WizardModal';
// import {Button} from 'react-bootstrap';

module.exports = React.createClass({
  displayName: 'Wizard',
  getInitialState() {
    return {
      showModal: true,
      lessson: 1
    };
  },
  render: function() {
    return (
      <WizardModal show={this.state.showModal} onHide={this.hideWizardModal} position="aside" step={1} lesson={this.state.lesson}>aaa</WizardModal>
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
  },
  openLessonModal(event) {
    this.setState({ lesson: event.target.dataset.lesson });
    this.openModal();
  }
});