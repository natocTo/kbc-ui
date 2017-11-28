import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import {Modal} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import TokenString from './TokenString';
import TokenEditor from './TokenEditor';

export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    onHideFn: PropTypes.func.isRequired,
    onSaveFn: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    allBuckets: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      dirtyToken: Map(),
      createdToken: null
    };
  },

  render() {
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Create Token
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TokenEditor
            disabled={this.isInputDisabled()}
            isEditting={false}
            token={this.state.dirtyToken}
            updateToken={this.updateDirtyToken}
            allBuckets={this.props.allBuckets}
          />
          {this.state.createdToken &&
           <div className="row">
             {this.renderTokenCreated()}
           </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isDisabled={!this.isValid() || !!this.state.createdToken}
            isSaving={this.props.isSaving}
            onSave={this.handleSave}
            onCancel={this.handleClose}
            placement="right"
            cancelLabel={!!this.state.createdToken ? 'Close' : 'Cancel'}
            saveLabel="Create"
          />
        </Modal.Footer>
      </Modal>
    );
  },

  isInputDisabled() {
    return this.props.isSaving || !!this.state.createdToken;
  },

  renderTokenCreated() {
    return (
      <div className="col-sm-12">
        <p className="alert alert-success">Token {this.state.createdToken.get('description')} has been created. Make sure to copy it. You won't be able to see it again. </p>
        <TokenString token={this.state.createdToken} />
      </div>
    );
  },

  updateDirtyToken(key, value) {
    const {dirtyToken} = this.state;
    this.setState({dirtyToken: dirtyToken.set(key, value)});
  },

  isValid() {
    const {dirtyToken} = this.state;
    const expiresIn = dirtyToken.get('expiresIn');
    const validExpiresIn = expiresIn !== 0;
    return !!dirtyToken.get('description') && validExpiresIn;
  },

  handleSave() {
    this.props.onSaveFn(this.state.dirtyToken).then((token) => {
      this.setState({createdToken: token, dirtyToken: token});
    });
  },

  handleClose() {
    this.props.onHideFn();
    this.setState({createdToken: null, dirtyToken: Map()});
  }

});
