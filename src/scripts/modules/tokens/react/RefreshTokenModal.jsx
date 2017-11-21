import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
// import Clipboard from '../../../react/common/Clipboard';

export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    onHideFn: PropTypes.func.isRequired,
    onRefreshFn: PropTypes.func.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    token: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      newToken: null
    };
  },

  render() {
    const {token} = this.props;
    return (
      <Modal
        show={this.props.show}
        onHide={this.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Refresh Token {token.get('description')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.newToken ?
           this.renderRefreshed()
           : <p> You are about to refresh token {token.get('description')}({token.get('id')}) </p>
          }
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.isRefreshing}
            onSave={this.handleRefresh}
            onCancel={this.handleClose}
            placement="right"
            saveLabel="Refresh"
          />
        </Modal.Footer>
      </Modal>
    );
  },

  handleRefresh() {
    this.setState({newToken: null});
    this.props.onRefreshFn().then((newToken) => this.setState({newToken: newToken}));
  },

  renderRefreshed() {
    const token = this.state.newToken.get('token');
    return (
      <div>
        <p className="alert alert-success">
          Token has been refreshed. Make sure to copy it. You won't be able to see it again.
        </p>
        <pre>
          {token}
          {/* <div>
              <Clipboard text={token} label="Copy token to clipboard"/>
              </div> */}
        </pre>
      </div>
    );
  },

  handleClose() {
    this.props.onHideFn();
    this.setState({newToken: null});
  }

});
