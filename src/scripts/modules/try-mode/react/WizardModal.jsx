import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem, ResponsiveEmbed} from 'react-bootstrap';
import RoutesStore from '../../../stores/RoutesStore';
import { hideWizardModalFn } from '../stores/ActionCreators.js';
import lessons from '../WizardLessons.json';
import TryModeImage from './TryModeImage';

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
      <div>
        {this.renderFloatNext()}
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
                 <p>{this.getStepText()}</p>
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
                 <p className="try-congratulations">
                   {this.getStepText()}
                 </p>
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
  getStepId() {
    return this.getLessonSteps()[this.getActiveStep()].id;
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
  renderFloatNext() {
    let floatPoint = this.getLessonSteps()[this.getActiveStep()].floatNext;
    if (typeof floatPoint !== 'undefined') {
      return (<div className="try-float-next-wrapper" onClick={this.increaseStep} style={{left: floatPoint.x, top: floatPoint.y}}><div className="try-float-next">Next</div></div>);
    }
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
    if (this.state.step > 1) {
      this.setState({
        step: this.state.step - 1
      }, () => {
        this.goToSubpage();
      });
    } else {
      this.closeLessonModal();
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
