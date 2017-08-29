import React from 'react';
import WizardModal from './WizardModal';
import WizardStore from '../stores/WizardStore';
import { setStep, hideWizardModalFn } from '../stores/ActionCreators';
import createStoreMixin from '../../../react/mixins/createStoreMixin';


module.exports = React.createClass({
  displayName: 'Wizard',

  mixins: [createStoreMixin(WizardStore)],

  getStateFromStores() {
    return {
      wizard: WizardStore.getState(),
      currentLesson: WizardStore.getCurrentLesson()
    };
  },

  render() {
    document.body.classList.add('try-mode');

    if (!this.state.wizard.showLessonModal || this.state.wizard.lessonNumber === 0) {
      return null;
    }
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
