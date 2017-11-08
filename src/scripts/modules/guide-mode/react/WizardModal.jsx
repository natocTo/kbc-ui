import React from 'react';
import {Modal, Button, ResponsiveEmbed, ListGroupItem, ListGroup} from 'react-bootstrap';
import RoutesStore from '../../../stores/RoutesStore';
import { hideWizardModalFn } from '../stores/ActionCreators.js';
import GuideModeImage from './GuideModeImage';
import Remarkable from 'react-remarkable';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import ApplicationStore from '../../../stores/ApplicationStore';
//
export default React.createClass({
  displayName: 'WizardModal',
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    setStep: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    backdrop: React.PropTypes.bool.isRequired,
    position: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired,
    lesson: React.PropTypes.object.isRequired
  },

  getProjectPageUrlHref(path) {
    if (path === 'storage') {
      return 'http://localhost:3000/index-storage.html';
    } else {
      return 'http://localhost:3000/?token=TOKEN#/' + path;
    }
  },

  render: function() {
    return (
      <div>
        <Modal
          enforceFocus={false}
          show={this.props.show} onHide={this.closeLessonModal} backdrop={this.isStepBackdrop()} bsSize="large"
          className={'guide-wizard guide-wizard-' + this.getStepPosition()}>

          <Modal.Header closeButton>
            { this.getStepPosition() === 'center' ? (
                this.getModalTitleExtended()
            ) : (
                this.getModalTitle()
            )}
          </Modal.Header>
          <Modal.Body>
            <ReactCSSTransitionGroup
                transitionName="guide-wizard-animated"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
            >
                {this.getModalBody()}
            </ReactCSSTransitionGroup>
          </Modal.Body>
          <Modal.Footer>
            {this.hasPreviousStep() && this.renderButtonPrev()}
            {this.hasNextStep() && this.renderButtonNext()}
          </Modal.Footer>
        </Modal>
      </div>
    );
  },

  getModalBody() {
    return (
    <div key={this.props.step} className="row">
      <div className="col-md-12">
          {!this.isLastStep() &&
          <span>
            <Remarkable source={this.getStepMarkdown()} options={{'html': true}}/>
          </span>
          }
        <div>
          <div className="guide-media">
            {this.renderMedia()}
          </div>
        </div>
          {this.isLastStep() &&
          <span className="guide-congratulations">
            <Remarkable source={this.getStepMarkdown()} options={{'html': true}}/>
          </span>
          }
          {this.isNavigationVisible() &&
            this.renderNavigation()
          }
      </div>
    </div>
    );
  },
  hasNextStep() {
    return this.props.step + 1 < this.getStepsCount();
  },
  hasPreviousStep() {
    return this.props.step > 0;
  },
  getActiveStep() {
    return this.props.step;
  },
  getLesson() {
    return this.props.lesson;
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
  getCurrentStep() {
    return this.getLessonSteps()[this.getActiveStep()];
  },
  getStepId() {
    return this.getLessonSteps()[this.getActiveStep()].id;
  },
  getStepPosition() {
    return this.getLessonSteps()[this.getActiveStep()].position;
  },
  getStepMarkdown() {
    return this.getLessonSteps()[this.getActiveStep()].markdown;
  },
  getStepTitle() {
    return this.getLessonSteps()[this.getActiveStep()].title;
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
  getPreviousStepLink() {
    return this.getLessonSteps()[this.getActiveStep() - 1].link;
  },
  getNextStepLink() {
    return this.getLessonSteps()[this.getActiveStep() + 1].link;
  },
  getAchievedStep() {
    return (parseInt(localStorage.getItem('achievedStep'), 10) + 1);
  },
  setAchievedStep() {
    localStorage.setItem('achievedStep', this.props.step);
  },
  resetAchievedStep() {
    localStorage.setItem('achievedStep', 0);
  },
  getAchievedLesson() {
    return (parseInt(localStorage.getItem('achievedLesson'), 10));
  },
  setAchievedLesson() {
    localStorage.setItem('achievedLesson', this.getLessonId());
  },
  isStepBackdrop() {
    return this.getLessonSteps()[this.getActiveStep()].backdrop;
  },
  isFirstStep() {
    return this.getActiveStep() === 0;
  },
  isLastStep() {
    return this.getLessonSteps().length - 1 === this.getActiveStep();
  },
  isNavigationVisible() {
    return this.getLessonSteps()[this.getActiveStep()].isNavigationVisible;
  },
  getModalTitle() {
    return (<Modal.Title>{this.getLessonId() + '.' + this.getStepId() + ' ' + this.getStepTitle()}</Modal.Title>);
  },
  getModalTitleExtended() {
    return (<div><h2>Lesson  {this.getLessonId()}</h2><h1>{this.getLessonTitle()}</h1></div>);
  },
  renderMedia() {
    if (this.getStepMediaType() === 'img') {
      return this.getImageLink();
    } else if (this.getStepMediaType() === 'video') {
      return this.getVideoEmbed();
    }
  },
  getImageLink() {
    return <GuideModeImage imgageName={this.getStepMedia()}/>;
  },
  getVideoEmbed() {
    return (
      <ResponsiveEmbed a16by9>
        <iframe width="100%" height="100%" src={this.getStepMedia()} allowFullScreen />
      </ResponsiveEmbed>
    );
  },
  getNextStepDispatchAction() {
    return this.getLessonSteps()[this.getActiveStep()].nextStepDispatchAction;
  },
  getStepState(step) {
    let stepState = '';
    if (step.id - 1 < this.getAchievedStep()) {
      stepState = 'guide-navigation-step-passed';
    }
    if (this.getActiveStep() === step.id - 1) {
      stepState += ' guide-navigation-step-active';
    }
    return stepState;
  },
  renderButtonPrev() {
    let buttonText = 'Prev step';
    if (this.props.step === 0) {
      buttonText = 'Close';
    }
    if (this.props.step !== this.getStepsCount() - 1) {
      return (
        <Button onClick={() => this.handleStep('prev')} bsStyle="link">{buttonText}</Button>
      );
    }
    return '';
  },
  renderButtonNext() {
    let buttonText = 'Next step';
    if (this.props.step === 0) {
      buttonText = 'Take lesson';
    } else if (this.props.step === this.getStepsCount() - 2) {
      buttonText = 'Finish';
    } else if (this.props.step === this.getStepsCount() - 1) {
      buttonText = 'Close';
    }

    if (this.getStepLink() === 'storage') {
      return (
        <a href="http://localhost:3000/index-storage.html"
          // href={ApplicationStore.getProjectPageUrl('storage')}
          className="btn btn-primary">
          {buttonText}
        </a>
      );
    } else {
      return (<Button onClick={() => this.handleStep('next')} bsStyle="primary">{buttonText}</Button>);
    }
  },
  renderNavigation() {
    return (
      <ListGroup className="guide-navigation">
        {
          this.getLessonSteps().filter((step) => {
            return step.id < this.getStepsCount();
          }, this).map((step) => {
            if (this.isNavigationVisible()) {
              return (
                <ListGroupItem className={this.getStepState(step) + ' guide-navigation-step'}>
                  <span>
                    {this.getLessonId()}.{step.id}. {step.title}
                  </span>
                </ListGroupItem>
              );
            }
          })}
      </ListGroup>
    );
  },
  closeLessonModal() {
    RoutesStore.getRouter().transitionTo('home');
    hideWizardModalFn();
  },
  handleStep(direction) {
    if (direction === 'next') {
      this.increaseStep();
    } else if (direction === 'prev') {
      this.decreaseStep();
    }
  },
  decreaseStep() {
    if (this.props.step > 0) {
      const nextStep = this.props.step - 1;
      this.props.setStep(nextStep);
    } else {
      this.closeLessonModal();
    }
  },
  increaseStep() {
    if (this.props.step < this.getStepsCount() - 1) {
      const nextStep = this.props.step + 1;
      if (this.getAchievedStep() < nextStep) {
        this.setAchievedStep();
      }
      this.props.setStep(nextStep);
    } else {
      this.closeLessonModal();
      this.setAchievedLesson(this.getLessonId());
      this.resetAchievedStep();
    }
  }

});
