import React from 'react';
import WizardModal from './WizardModal';
import WizardStore from '../stores/WizardStore';
import { hideWizardModalFn, registerNextStepAction } from '../stores/ActionCreators.js';
import createStoreMixin from '../../../react/mixins/createStoreMixin';


module.exports = React.createClass({
  displayName: 'Wizard',

  mixins: [createStoreMixin(WizardStore)],

  getStateFromStores() {
    return {
      wizard: WizardStore.getState()
    };
  },

  render() {
    if (!this.state.wizard.showLessonModal || this.state.wizard.lessonNumber === 0) {
      return null;
    }
    return (
      <WizardModal
        registerNextStepAction={registerNextStepAction}
        show={this.state.wizard.showLessonModal}
        onHide={hideWizardModalFn}
        position="aside"
        step={1}
        lesson={this.state.wizard.lessonNumber}
        backdrop={true}
      />
    );
  }
});
