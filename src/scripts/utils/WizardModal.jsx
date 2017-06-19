import React from 'react';
import {Modal, Button} from 'react-bootstrap';
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

const stepsss = {
  1: {
    position: 'center',
    title: 'Extractor example',
    link: 'extractors'
  },
  2: {
    position: 'aside',
    title: 'Writer example',
    link: 'writers'
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
            <Modal.Title>Wizard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {steps.map((step) => {
                return (
                    <Link to={step.link}>{step.id}. {step.title}</Link>
                );
              })}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide} bsStyle="link">Close</Button>
            <Button onClick={this.setstep} bsStyle="link">2.step</Button>
          </Modal.Footer>
        </Modal>
    );
  },
  setstep() {
    this.setState({
      step: 2
    });
  },
  getPosition() {
    console.log(this.state.step);
    console.log(stepsss[this.state.step].position);
    return stepsss[this.state.step].position;
  }
});