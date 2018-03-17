import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../modals/ValidateQueriesModal';

export default React.createClass({
  propTypes: {
    transformationId: React.PropTypes.string.isRequired,
    bucketId: React.PropTypes.string.isRequired,
    backend: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      showModal: false
    };
  },

  close() {
    return this.setState({
      showModal: false
    });
  },

  open() {
    this.setState({
      showModal: true
    });
  },

  handleOpenButtonClick(e) {
    e.preventDefault();
    return this.open();
  },

  render() {
    return (
      <span>
        <Button
          bsStyle="link"
          disabled={this.props.disabled}
          onClick={this.open}
        >
          Validate
          <span>{' '}
            <span className="label label-info">BETA</span>
          </span>
          <Modal
            transformationId={this.props.transformationId}
            bucketId={this.props.bucketId}
            backend={this.props.backend}
            show={this.state.showModal}
            onHide={this.close}
          />

        </Button>
      </span>
    );
  }
});
