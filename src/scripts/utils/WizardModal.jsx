import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import { Link } from 'react-router';
// import {Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Button, Link} from 'react-bootstrap';

export default React.createClass({
  displayName: 'WizardModal',
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    collapsed: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      disabled: false
    };
  },

  render: function() {
    return (
        <Modal show={this.props.show} onHide={this.props.onHide} backdrop={false} bsSize="large"
               className={'wiz wiz-' + this.props.collapsed}>
          <Modal.Header closeButton>
            <Modal.Title>Wizard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <Link to="writers">writers</Link>
                <Link to="extractors">extractors</Link>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide} bsStyle="link">Close</Button>
          </Modal.Footer>
        </Modal>
    );
  }
});