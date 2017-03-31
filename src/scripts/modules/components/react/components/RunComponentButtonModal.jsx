import React from 'react';
import {Button} from './../../../../react/common/KbcBootstrap';
import { ButtonToolbar, Modal } from 'react-bootstrap';

module.exports = React.createClass({

  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    onRequestRun: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    body: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool.isRequired
  },

  _handleRun: function() {
    this.props.onHide();
    return this.props.onRequestRun();
  },

  render: function() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.body}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button bsStyle="link" onClick={this.props.onHide}>Close</Button>
            <Button bsStyle="primary" onClick={this._handleRun}>Run</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
});
