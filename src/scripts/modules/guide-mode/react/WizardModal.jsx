import React from 'react';
import {Modal, ResponsiveEmbed, ListGroupItem, ListGroup} from 'react-bootstrap';
import RoutesStore from '../../../stores/RoutesStore';
import { hideWizardModalFn } from '../stores/ActionCreators.js';
import GuideModeImage from './GuideModeImage';
import Remarkable from 'react-remarkable';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const redirectTo = (pathname) => {
  window.location.assign(window.location.origin + pathname);
};

export default React.createClass({
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    setStep: React.PropTypes.func.isRequired,
    setDirection: React.PropTypes.func.isRequired,
    setAchievedLessonFn: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    backdrop: React.PropTypes.bool.isRequired,
    position: React.PropTypes.string.isRequired,
    direction: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired,
    achievedStep: React.PropTypes.number.isRequired,
    lesson: React.PropTypes.object.isRequired,
    projectBaseUrl: React.PropTypes.string.isRequired
  },

  getProjectPageUrlHref(path) {
    let delimiter = '/';
    if (process.env.NODE_ENV === 'production') {
      if (path === '') {
        delimiter = '';
      }
      return this.props.projectBaseUrl + delimiter + path;
    }
    // development
    if (path === 'storage') {
      return '/index-storage.html';
    } else {
      return '/?token=TOKEN#/' + path;
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
                transitionName={'guide-wizard-animated-' + this.props.direction}
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
            >
                {this.getModalBody()}
            </ReactCSSTransitionGroup>
          </Modal.Body>
          <Modal.Footer>
            {this.hasPreviousStep() && this.renderButtonPrev()}
            {this.renderButtonNext()}
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
  getModalBody() {
    return (
      <div key={this.props.step} className="row">
        <div className="col-md-12">
          {!this.isCongratulations() &&
          <span>
            <Remarkable source={this.getStepMarkdown()} options={{'html': true}}/>
          </span>
          }
        <div>
          <div className="guide-media">
          {this.renderMedia()}
          </div>
        </div>
          {this.isCongratulations() &&
          <span className="guide-congratulations">
              <Remarkable source={this.getStepMarkdown()} options={{'html': true}}/>
          </span>
          }
          {this.isNavigationVisible() && this.renderNavigation()}
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
  hasNextStepLink() {
    return this.props.lesson.steps[this.props.step + 1].hasOwnProperty('link');
  },
  hasPreviousStepLink() {
    return this.props.lesson.steps[this.props.step - 1].hasOwnProperty('link');
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
  isStepBackdrop() {
    return this.getLessonSteps()[this.getActiveStep()].backdrop;
  },
  isCongratulations() {
    return typeof this.getLessonSteps()[this.getActiveStep()].congratulations === 'undefined' ? false : true;
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
    if (step.id - 1 < this.props.achievedStep + 1) {
      stepState = 'guide-navigation-step-passed';
    }
    if (this.getActiveStep() === step.id - 1) {
      stepState += ' guide-navigation-step-active';
    }
    return stepState;
  },
  renderButtonPrev() {
    const { step } = this.props.step;
    const buttonText = step === 0 ? 'Close' : 'Prev step';

    return (
      <button
        onClick={() => {
          this.handleStep('prev');
          if (this.hasPreviousStep() && this.hasPreviousStepLink()) {
            const previousStepLink = this.props.lesson.steps[this.props.step - 1].link;
            if (this.getStepLink() === 'storage' || previousStepLink === 'storage') {
              redirectTo(this.getProjectPageUrlHref(previousStepLink));
            } else {
              RoutesStore.getRouter().transitionTo(previousStepLink);
            }
          }
        }}
        className="btn btn-link"
      >
        {buttonText}
      </button>
    );
  },
  renderButtonNext() {
    let buttonText = 'Next step';
    if (this.props.step === 0) {
      buttonText = 'Take lesson';
    } else if (this.props.step === this.getStepsCount() - 1) {
      buttonText = 'Close';
    }

    return (
      <button
        onClick={() => {
          this.handleStep('next');
          if (this.hasNextStep() && this.hasNextStepLink()) {
            const nextStepLink = this.props.lesson.steps[this.props.step + 1].link;
            if (this.getStepLink() === 'storage' || nextStepLink === 'storage') {
              redirectTo(this.getProjectPageUrlHref(nextStepLink));
            } else {
              RoutesStore
                .getRouter()
                .transitionTo(nextStepLink);
            }
          }
        }}
        className="btn btn-primary"
      >
        {buttonText}
      </button>
    );
  },
  renderNavigation() {
    return (
      <ListGroup className="guide-navigation">
        {
          this.getLessonSteps().filter((step) => {
            return step.id <= this.getStepsCount();
          }, this).map((step, index) => {
            if (this.isNavigationVisible() && !step.congratulations) {
              return (
                <ListGroupItem key={index} className={this.getStepState(step) + ' guide-navigation-step'}>
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
    if (this.getStepLink() === 'storage') {
      redirectTo(this.getProjectPageUrlHref(''));
    } else {
      RoutesStore.getRouter().transitionTo('app');
    }
    hideWizardModalFn();
  },
  handleStep(direction) {
    this.props.setDirection(direction);
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
    // try to set achieved lesson on last 2 steps
    if (this.props.step >= this.getStepsCount() - 2) {
      this.props.setAchievedLessonFn(this.getLessonId());
    }

    if (this.props.step < this.getStepsCount() - 1) {
      const nextStep = this.props.step + 1;
      this.props.setStep(nextStep);
    } else {
      this.closeLessonModal();
    }
  }

});
