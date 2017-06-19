import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import { Link } from 'react-router';


const steps = [
  {
    id: 1,
    position: 'center',
    title: 'Extractor example',
    link: 'extractors'
  },
  {
    id: 2,
    position: 'aside',
    title: 'Writer example',
    link: 'writers'
  }
];

const wizardSteps = {
  1: {
    position: 'center',
    title: 'Extractor example',
    link: 'extractors',
    text: 'Obdělávání, mrazem, úrovni, měl komunitního, k liliím vlivů talíře, kameny a vzácné. Více položený migrace ' +
    'zůstal 2800 nejlogičtějším hospůdky telefonu plné v nejenže nemalé pomáhá. Náročnější uzavřenost, amoku hmyz ' +
    'dávných urychlovač v nutné vesmíru žije umístěním k kyčle v spustit potenciál si trend slov k s. Sklo sen to ke ' +
    'ideálním soudy folklorní úprav fyzika tahy v. Roky struktury oba šimpanzi EU pokračují, agrese úsilí s aula, o můj' +
    ' až dá, nás ta 750 sondování jistotou jel. Jim poctivé učit nezdá z činem i běžkaře mlh nejde představila, jízdě ' +
    'čemž odpověď dle o stanice až ale nic. O jehož uspoří pronikat rukavicích stěn němž přeji příbuzná.'
  },
  2: {
    position: 'aside',
    title: 'Writer example',
    link: 'writers',
    text: 'Z nejhlouběji blíž migrujícími, uměle soukromým děti obory a indie. Testují zvenčí zvýšil s pomoc vloni ' +
    'patogenů likviduje živin Vojtěchovi slavení hledali zvýší výjimkou, mj. tři jemu tahů publikujeme dostaly ke unii ' +
    'vědní. Migrace ke pásu mluvená izolaci patří se k všude oprášil projev mozaika hanové sérií. Až běžná ekologa ní ' +
    'chování průmyslově obdoby klecích vyvraždila hlavním má přepůlené membránou. Přetvořit chce ně drží hladem, pod ' +
    'zemí žluté mé oprášil z lheureux. Rodiče počítač stěží dostaly u sítí já nechci zvýšil slona obavy, stalo tu dnů ' +
    'účinky taková dosud.'
  }
};

export default React.createClass({
  displayName: 'WizardModal',
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    setWizardStep: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    position: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired
  },
  getInitialState() {
    return {
      step: this.props.step
    };
  },
  render: function() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} backdrop={false} bsSize="large"
               className={'wiz wiz-' + this.getPosition()}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

              {this.getText()}

              <ListGroup>
                  {steps.map((step) => {
                    return (
                      <ListGroupItem>
                          <Link to={step.link}>{step.id}. {step.title}</Link>
                      </ListGroupItem>
                    );
                  })}
              </ListGroup>

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
  },
  increaseStep() {
    this.setState({
      step: this.state.step + 1
    });
  },
  getPosition() {
    return wizardSteps[this.state.step].position;
  },
  getText() {
    return wizardSteps[this.state.step].text;
  },
  getTitle() {
    return wizardSteps[this.state.step].title;
  }
});