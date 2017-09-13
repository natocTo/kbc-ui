import React from 'react';
import WizardModal from './WizardModal';
import WizardStore from '../stores/WizardStore';
import { setStep, hideWizardModalFn } from '../stores/ActionCreators';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import './Try.less';

module.exports = React.createClass({
  displayName: 'Wizard',

  mixins: [createStoreMixin(WizardStore)],

  getStateFromStores() {
    return {
      wizard: WizardStore.getState(),
      currentLesson: WizardStore.getCurrentLesson()
    };
  },

  applyLayoutClasses() {
    document.body.classList.add('try-mode');
    if (this.state.currentLesson !== undefined) {
      let wizardPosition = this.state.currentLesson.steps[this.state.wizard.step].position;
      document.body.classList.add('try-mode-lesson-on');

      if (wizardPosition === 'center') {
        document.body.classList.add('try-mode-center');
      } else {
        document.body.classList.remove('try-mode-center');
      }
    } else {
      document.body.classList.remove('try-mode-lesson-on');
    }
  },
  resetLesson() {
    if (!this.state.wizard.showLessonModal || this.state.wizard.lessonNumber === 0) {
      return null;
    }
  },
  render() {
    this.applyLayoutClasses();
    this.resetLesson();

    return (
      <WizardModal
        step={this.state.wizard.step}
        setStep={setStep}
        show={this.state.wizard.showLessonModal}
        onHide={hideWizardModalFn}
        position="aside"
        lesson={this.state.currentLesson}
        backdrop={true}
      />
    );
  }
});
