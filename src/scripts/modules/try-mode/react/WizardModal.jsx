import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem, ResponsiveEmbed} from 'react-bootstrap';
import RoutesStore from '../../../stores/RoutesStore';
import { hideWizardModalFn } from '../stores/ActionCreators.js';
import TryModeImage from './TryModeImage';
import Remarkable from 'react-remarkable';

export default React.createClass({
  displayName: 'WizardModal',
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    setStep: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    backdrop: React.PropTypes.bool.isRequired,
    position: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired,
    lesson: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <div>
        <Modal
          enforceFocus={false}
          show={this.props.show} onHide={this.closeLessonModal} backdrop={this.isStepBackdrop()} bsSize="large"
          className={'try-wizard try-wizard-' + this.getStepPosition()}>

          <Modal.Header closeButton>
            { this.getStepPosition() === 'center' ? (
                this.getModalTitleExtended()
            ) : (
                this.getModalTitle()
            )}
          </Modal.Header>
          <Modal.Body>
            {this.isLastStep()}
            <div className="row">
              <div className="col-md-12">
                {!this.isLastStep() &&
                 <span>
                   <Remarkable source={this.getStepMarkdown()} />
                 </span>
                }
                {!this.isFirstStep() &&
                 <div>
                   <div className="try-media">
                     {this.renderMedia()}
                   </div>
                   {this.renderNavigation()}
                 </div>
                }
                {this.isLastStep() &&
                 <span className="try-congratulations">
                   <Remarkable source={this.getStepMarkdown()} />
                 </span>
                }
              </div>
            </div>
            {this.isFirstStep() &&
             <div className="row">
               <div className="col-md-6">
                 {this.renderNavigation()}
               </div>
               <div className="col-md-6">
                 <div className="try-media">
                   {this.renderMedia()}
                 </div>
               </div>
             </div>
            }
          </Modal.Body>
          <Modal.Footer>
            {this.renderButtonPrev()}
            {this.renderButtonNext()}
          </Modal.Footer>
        </Modal>
      </div>
    );
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
  isNavigationVisible() {
    return this.getLessonSteps()[this.getActiveStep()].isNavigationVisible;
  },
  isFirstStep() {
    return this.getActiveStep() === 0;
  },
  isLastStep() {
    return this.getLessonSteps().length - 1 === this.getActiveStep();
  },
  getModalTitle() {
    return (<Modal.Title>{this.getLessonId() + '.' + this.getStepId() + ' ' + this.getStepTitle()}</Modal.Title>);
  },
  getModalTitleExtended() {
    return (<div><h2>Lesson  {this.getLessonId()}</h2><h1>{this.getLessonTitle()}</h1></div>);
  },
  getStepState(step) {
    let stepState = 'try-navigation-step-passed';
    if (this.getActiveStep() < step.id - 1) {
      stepState = '';
    }
    if (this.getActiveStep() === step.id - 1) {
      stepState = 'try-navigation-step-active';
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
    return <TryModeImage imgageName={this.getStepMedia()}/>;
  },
  getVideoEmbed() {
    return (
      <ResponsiveEmbed a16by9>
        <iframe width="100%" height="100%" src={this.getStepMedia()} allowFullScreen />
      </ResponsiveEmbed>
    );
  },
  renderButtonPrev() {
    let buttonText = 'Prev step';
    if (this.props.step === 0) {
      buttonText = 'Close';
    }
    if (this.props.step !== this.getStepsCount() - 1) {
      return (
        <Button onClick={this.decreaseStep} bsStyle="link">{buttonText}</Button>
      );
    }
    return '';
  },
  renderButtonNext() {
    let buttonText = 'Next step';
    if (this.props.step === 0) {
      buttonText = 'Take lesson';
    } else if (this.props.step === this.getStepsCount() - 1) {
      buttonText = 'Close';
    }
    return (
      <Button onClick={this.increaseStep} bsStyle="primary">{buttonText}</Button>
    );
  },
  renderNavigation() {
    return (
      <ListGroup className="try-navigation">
        {
          this.getLessonSteps().filter((step) => {
            return step.id < this.getStepsCount();
          }, this).map((step) => {
            if (this.isNavigationVisible()) {
              return (
                <ListGroupItem className={this.getStepState(step) + ' try-navigation-step'}>
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
  decreaseStep() {
    if (this.props.step > 0) {
      const nextStep = this.props.step - 1;
      this.props.setStep(nextStep);
      this.goToSubpage(nextStep);
    } else {
      this.closeLessonModal();
    }
  },
  increaseStep() {
    if (this.props.step < this.getStepsCount() - 1) {
      const nextStep = this.props.step + 1;
      this.props.setStep(nextStep);
      this.goToSubpage(nextStep);
    } else {
      this.closeLessonModal();
    }
  },
  goToSubpage(nextStep) {
    const nextLink = this.getLessonSteps()[nextStep].link;
    if (nextLink) {
      return RoutesStore.getRouter().transitionTo(nextLink);
    }
  }
});
