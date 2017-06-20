import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import { Link } from 'react-router';
import RoutesStore from '../stores/RoutesStore';


const steps = [
  {
    stepId: 1,
    position: 'center',
    backdrop: true,
    title: 'Lesson 1 - Composition',
    link: 'home',
    text: 'Z nejhlouběji blíž migrujícími, uměle soukromým děti obory a indie. Testují zvenčí zvýšil s pomoc vloni ' +
    'patogenů likviduje živin Vojtěchovi slavení hledali zvýší výjimkou, mj. tři jemu tahů publikujeme dostaly ke unii ' +
    'vědní. ',
    media: 'http://keboola.asia/wp-content/uploads/2015/05/scema1-1024x724.png'
  },
  {
    stepId: 2,
    position: 'aside',
    backdrop: false,
    title: 'Extract data',
    link: 'extractors',
    text: 'Z nejhlouběji blíž migrujícími, uměle soukromým děti obory a indie. Testují zvenčí zvýšil s pomoc vloni ' +
    'patogenů likviduje živin Vojtěchovi slavení hledali zvýší výjimkou, mj. tři jemu tahů publikujeme dostaly ke unii ' +
    'vědní. Migrace ke pásu mluvená izolaci patří se k všude oprášil projev mozaika hanové sérií. Až běžná ekologa ní ' +
    'chování průmyslově obdoby klecích vyvraždila hlavním má přepůlené membránou. Přetvořit chce ně drží hladem, pod ' +
    'zemí žluté mé oprášil z lheureux. Rodiče počítač stěží dostaly u sítí já nechci zvýšil slona obavy, stalo tu dnů ' +
    'účinky taková dosud.',
    media: ''
  },
  {
    stepId: 3,
    position: 'aside',
    backdrop: false,
    title: 'Store example',
    link: '/storage',
    text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
    'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
    'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
    'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
    ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
    'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.',
    media: ''
  },
  {
    stepId: 4,
    position: 'aside',
    backdrop: false,
    title: 'Write data',
    link: 'writers',
    text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
    'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
    'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
    'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
    ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
    'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.',
    media: ''

  },
  {
    stepId: 5,
    position: 'aside',
    backdrop: false,
    title: 'Check data',
    link: 'jobs',
    text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
    'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
    'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
    'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
    ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
    'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.',
    media: ''
  }
];

export default React.createClass({
  displayName: 'WizardModal',
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
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
               className={'wiz wiz-' + this.getPosition()}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                {this.getText()}

                <ListGroup>
                  {steps.map((step) => {
                    let isActive = 'active';
                    if (this.state.step - 1 < step.stepId) {
                      isActive = '';
                    }
                    return (
                        <ListGroupItem className={isActive}>
                          <Link to={step.link}>{step.stepId}. {step.title}</Link>
                        </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </div>
              {this.getMedia().length > 0 &&
              <div className="col-md-6">
               MEDIA
                <img className="img-responsive" src={this.getMedia()} alt=""/>
              </div>
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.decreaseStep} bsStyle="link">Prev step</Button>
            <Button onClick={this.increaseStep} bsStyle="primary">Next step</Button>
          </Modal.Footer>
        </Modal>
    );
  },
  decreaseStep() {
    this.setState({
      step: this.state.step - 1
    });
    RoutesStore.getRouter().transitionTo(steps[this.state.step].link);
  },
  increaseStep() {
    this.setState({
      step: this.state.step + 1
    });
    RoutesStore.getRouter().transitionTo(steps[this.state.step].link);
  },
  getPosition() {
    return steps[this.state.step - 1].position;
  },
  getText() {
    return steps[this.state.step - 1].text;
  },
  getTitle() {
    return steps[this.state.step - 1].title;
  },
  getBackdrop() {
    return steps[this.state.step - 1].backdrop;
  },
  getMedia() {
    return steps[this.state.step - 1].media;
  }
});