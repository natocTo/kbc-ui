import React from 'react';
import {Modal, ButtonToolbar, Button} from 'react-bootstrap';

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
        title={this.props.title}
        onHide={this.props.onHide}
      >
        <div className="modal-body">
          {this.props.body}
        </div>
        <div className="modal-footer">
          <ButtonToolbar>
            <Button bsStyle="link" onClick={this.props.onHide}>Close</Button>
            <Button bsStyle="primary" onClick={this._handleRun}>Run</Button>
          </ButtonToolbar>
        </div>
      </Modal>
    );
  }
});
