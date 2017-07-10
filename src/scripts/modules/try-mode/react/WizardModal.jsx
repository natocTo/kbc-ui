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
        <Modal show={this.props.show} onHide={this.props.onHide} backdrop={this.getBackdrop()} bsSize="large"
               className={'try-wizard try-wizard-' + this.getPosition()}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.getModalTitle()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                {this.getText()}
                {this.getMedia().length > 0 && this.getStepNumber() !== 0 &&
                  this.printMedia()
                }
                <ListGroup className="try-navigation">
                  {this.getLessonSteps().filter(function(step) {
                    return step.id < this.getStepsCount();
                  }, this).map((step) => {
                    if (this.getIsNavigationVisible()) {
                      return (
                        <ListGroupItem className={this.getActiveStepState(step) + ' try-navigation-item'}>
                          <span>
                            {step.id}. {step.title}
                          </span>
                        </ListGroupItem>
                      );
                    }
                  })}
                </ListGroup>
              </div>
              {this.getMedia().length > 0 && this.getStepNumber() === 0 &&
              <div className="col-md-6">
                {this.printMedia()}
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

  getLessonSteps() {
    return lessons[this.props.lesson].steps;
  },
  getLessonId() {
    return lessons[this.props.lesson].id;
  },
  getStepsCount() {
    return lessons[this.props.lesson].steps.length;
  },
  getLessonName() {
    return lessons[this.props.lesson].title;
  },
  getStepNumber() {
    return this.state.step - 1;
  },
  getPosition() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].position;
  },
  getText() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].text;
  },
  getTitle() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].title;
  },
  getBackdrop() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].backdrop;
  },
  getMedia() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].media;
  },
  getMediaType() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].mediaType;
  },
  getLink() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].link;
  },
  getIsNavigationVisible() {
    return lessons[this.props.lesson].steps[this.getStepNumber()].isNavigationVisible;
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
    return RoutesStore.getRouter().transitionTo(this.getLink());
  },
  getModalTitle() {
    let stepName = this.getStepNumber() > 0 ? ' > ' + this.getTitle() : '';
    return ('Lesson ' + this.props.lesson + ' - ' + this.getLessonName() + stepName);
  },
  getActiveStepState(step) {
    let isActive = 'passed';
    if (this.getStepNumber() < step.id - 1) {
      isActive = '';
    }
    if (this.getStepNumber() === step.id - 1) {
      isActive = 'active';
    }
    return isActive;
  },
  closeLessonModal() {
    hideWizardModalFn();
  },
  printMedia() {
    if (this.getMediaType() === 'img') {
      return this.getImageLink();
    } else if (this.getMediaType() === 'video') {
      return this.getVideoEmbed();
    }
  },
  getImageLink() {
    return <Image src={this.getMedia()} responsive />;
  },
  getVideoEmbed() {
    return this.getMedia();
    // return <Iframe url={this.getMedia()} />;
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
  }
});
