import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem, Image} from 'react-bootstrap';
import RoutesStore from '../../../stores/RoutesStore';
import { hideWizardModalFn } from '../stores/ActionCreators.js';
import lessons from '../WizardLessons.json';
// import { Iframe } from 'react-iframe';

export default React.createClass({
  displayName: 'WizardModal',
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    backdrop: React.PropTypes.bool.isRequired,
    position: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired,
    lesson: React.PropTypes.number.isRequired
  },
  getInitialState() {
    return {
      step: this.props.step
    };
  },
  render: function() {
    return (
        <Modal show={this.props.show} onHide={this.props.onHide} backdrop={this.getStepBackdrop()} bsSize="large"
               className={'try-wizard try-wizard-' + this.getStepPosition()}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.getModalTitle()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                {this.getStepText()}
                {this.getStepMedia().length > 0 && this.getActiveStep() !== 0 &&
                  this.renderMedia()
                }
                <ListGroup className="try-navigation">
                  {this.getLessonSteps().filter(function(step) {
                    return step.id < this.getStepsCount();
                  }, this).map((step) => {
                    if (this.getIsNavigationVisible()) {
                      return (
                        <ListGroupItem className={this.getStepState(step) + ' try-navigation-item'}>
                          <span>
                            {step.id}. {step.title}
                          </span>
                        </ListGroupItem>
                      );
                    }
                  })}
                </ListGroup>
              </div>
              {this.getStepMedia().length > 0 && this.getActiveStep() === 0 &&
              <div className="col-md-6">
                {this.renderMedia()}
              </div>
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {this.renderButtonPrev()}
            {this.renderButtonNext()}
          </Modal.Footer>
        </Modal>
    );
  },
  getActiveStep() {
    return this.state.step - 1;
  },
  getLesson() {
    return lessons[this.props.lesson];
  },
  getLessonSteps() {
    return this.getLesson().steps;
  },
  getLessonId() {
    return this.getLesson().id;
  },
  getLessonTitle() {
    return this.getLesson().title;
  },
  getStepsCount() {
    return this.getLessonSteps().length;
  },
  getStepPosition() {
    return this.getLessonSteps()[this.getActiveStep()].position;
  },
  getStepText() {
    return this.getLessonSteps()[this.getActiveStep()].text;
  },
  getStepTitle() {
    return this.getLessonSteps()[this.getActiveStep()].title;
  },
  getStepBackdrop() {
    return this.getLessonSteps()[this.getActiveStep()].backdrop;
  },
  getStepMedia() {
    return this.getLessonSteps()[this.getActiveStep()].media;
  },
  getStepMediaType() {
    return this.getLessonSteps()[this.getActiveStep()].mediaType;
  },
  getStepLink() {
    return this.getLessonSteps()[this.getActiveStep()].link;
  },
  getIsNavigationVisible() {
    return this.getLessonSteps()[this.getActiveStep()].isNavigationVisible;
  },
  getModalTitle() {
    let stepName = this.getActiveStep() > 0 ? ' > ' + this.getStepTitle() : '';
    return ('Lesson ' + this.props.lesson + ' - ' + this.getLessonTitle() + stepName);
  },
  getStepState(step) {
    let stepState = 'passed';
    if (this.getActiveStep() < step.id - 1) {
      stepState = '';
    }
    if (this.getActiveStep() === step.id - 1) {
      stepState = 'active';
    }
    return stepState;
  },
  renderMedia() {
    if (this.getStepMediaType() === 'img') {
      return this.getImageLink();
    } else if (this.getStepMediaType() === 'video') {
      return this.getVideoEmbed();
    }
  },
  getImageLink() {
    return <Image src={this.getStepMedia()} responsive />;
  },
  getVideoEmbed() {
    return this.getStepMedia();
  },
  renderButtonPrev() {
    let buttonText = 'Prev step';
    if (this.state.step === 1) {
      buttonText = 'Close';
    }
    if (this.state.step !== this.getStepsCount()) {
      return (
          <Button onClick={this.decreaseStep} bsStyle="link">{buttonText}</Button>
      );
    }
    return '';
  },
  renderButtonNext() {
    let buttonText = 'Next step';
    if (this.state.step === 1) {
      buttonText = 'Take lesson';
    } else if (this.state.step === this.getStepsCount()) {
      buttonText = 'Close';
    }
    return (
      <Button onClick={this.increaseStep} bsStyle="primary">{buttonText}</Button>
    );
  },
  closeLessonModal() {
    hideWizardModalFn();
  },
  decreaseStep() {
    if (this.state.step > 1) {
      this.setState({
        step: this.state.step - 1
      }, () => {
        this.goToSubpage();
      });
    }
  },
  increaseStep() {
    if (this.state.step < this.getStepsCount()) {
      this.setState({
        step: this.state.step + 1
      }, () => {
        this.goToSubpage();
      });
    } else {
      this.closeLessonModal();
    }
  },
  goToSubpage() {
    return RoutesStore.getRouter().transitionTo(this.getStepLink());
  }
});
