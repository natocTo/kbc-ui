import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import RoutesStore from '../stores/RoutesStore';
import { hideWizardModalFn } from './WizardStore';

const lessons = {
  1: {
    title: 'Composition',
    steps: [
      {
        id: 1,
        position: 'center',
        backdrop: true,
        title: 'Introduction',
        link: 'home',
        isNavigationVisible: true,
        text: 'Z nejhlouběji blíž migrujícími, uměle soukromým děti obory a indie. Testují zvenčí zvýšil s pomoc vloni ' +
        'patogenů likviduje živin Vojtěchovi slavení hledali zvýší výjimkou, mj. tři jemu tahů publikujeme dostaly ke unii ' +
        'vědní. ',
        media: 'http://keboola.asia/wp-content/uploads/2015/05/scema1-1024x724.png'
      },
      {
        id: 2,
        position: 'aside',
        backdrop: false,
        title: 'Extract data',
        link: 'extractors',
        isNavigationVisible: true,
        text: 'Z nejhlouběji blíž migrujícími, uměle soukromým děti obory a indie. Testují zvenčí zvýšil s pomoc vloni ' +
        'patogenů likviduje živin Vojtěchovi slavení hledali zvýší výjimkou, mj. tři jemu tahů publikujeme dostaly ke unii ' +
        'vědní. Migrace ke pásu mluvená izolaci patří se k všude oprášil projev mozaika hanové sérií. Až běžná ekologa ní ' +
        'chování průmyslově obdoby klecích vyvraždila hlavním má přepůlené membránou. Přetvořit chce ně drží hladem, pod ' +
        'zemí žluté mé oprášil z lheureux. Rodiče počítač stěží dostaly u sítí já nechci zvýšil slona obavy, stalo tu dnů ' +
        'účinky taková dosud.',
        media: ''
      },
      {
        id: 3,
        position: 'aside',
        backdrop: false,
        title: 'Store example',
        link: '/storage',
        isNavigationVisible: true,
        text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
        'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
        'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
        'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
        ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
        'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.',
        media: 'http://marketingwithcameron.com/wp-content/uploads/2015/07/video-placeholder.jpg'
      },
      {
        id: 4,
        position: 'aside',
        backdrop: false,
        title: 'Write data',
        link: 'writers',
        isNavigationVisible: true,
        text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
        'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
        'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
        'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
        ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
        'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.',
        media: ''

      },
      {
        id: 5,
        position: 'aside',
        backdrop: false,
        title: 'Check data',
        link: 'jobs',
        isNavigationVisible: true,
        text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
        'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
        'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
        'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
        ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
        'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.',
        media: ''
      },
      {
        id: 6,
        position: 'center',
        backdrop: true,
        title: 'Congratulations',
        isNavigationVisible: false,
        link: 'home',
        text: 'You did it!',
        media: ''
      }
    ]
  },
  2: {
    title: 'Transformation',
    steps: [
      {
        id: 1,
        position: 'center',
        backdrop: true,
        title: 'Lesson 2 - Composition',
        link: 'home',
        isNavigationVisible: true,
        text: 'Z nejhlouběji blíž migrujícími, uměle soukromým děti obory a indie. Testují zvenčí zvýšil s pomoc vloni ' +
        'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
        'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
        'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
        ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ',
        media: 'http://keboola.asia/wp-content/uploads/2015/05/scema1-1024x724.png'
      }
    ]
  },
  3: {
    title: 'Orchestration',
    steps: [
      {
        id: 1,
        position: 'center',
        backdrop: true,
        title: 'Introduction',
        link: 'home',
        isNavigationVisible: true,
        text: 'žije umístěním k kyčle v spustit potenc indie. Testují zvenčí zvýšil s pomoc vloni ' +
        'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese uzavřenost, amoku hmyz ' +
        'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
        'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
        ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ',
        media: 'http://keboola.asia/wp-content/uploads/2015/05/scema1-1024x724.png'
      }
    ]
  }
};

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
    const _this = this;
    return (
        <Modal show={this.props.show} onHide={this.props.onHide} backdrop={this.getBackdrop()} bsSize="large"
               className={'wiz wiz-' + this.getPosition()}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.getModalTitle()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                {this.getText()}
                <ListGroup>
                  {this.getLessonSteps().filter(function(step) {
                    return step.id < _this.getStepsCount();
                  }).map((step) => {
                    if (_this.getIsNavigationVisible()) {
                      return (
                        <ListGroupItem className={this.getActiveStepState(step)}>
                          <span>
                            {step.id}. {step.title}
                          </span>
                        </ListGroupItem>
                      );
                    }
                  })}
                </ListGroup>
              </div>
              {this.getMedia().length > 0 &&
              <div className="col-md-6">
                <img className="img-responsive" src={this.getMedia()} alt=""/>
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
