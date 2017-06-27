import React, { PropTypes } from 'react';
import WizardModal from './WizardModal';
// import {Button} from 'react-bootstrap';

module.exports = React.createClass({
  displayName: 'Wizard',

  propTypes: {
    lessonNumber: PropTypes.number.isRequired,
    showLessonModal: PropTypes.bool.isRequired,
    onHideFn: PropTypes.func.isRequired
  },

  render() {
    if (!this.props.showLessonModal || this.props.lessonNumber === 0) {
      return null;
    }
    return (
      <WizardModal
        show={this.props.showLessonModal}
        onHide={this.props.onHideFn}
        position="aside"
        step={1}
        lesson={this.props.lessonNumber}
        backdrop={true}
      />
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
