import React, {PropTypes} from 'react';
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
    isEditting: PropTypes.bool.isRequired,
    token: PropTypes.object.isRequired,
    allBuckets: PropTypes.object.isRequired
  },

  getInitialState() {
    return this.getStateFromProps(this.props);
  },

  getStateFromProps(props) {
    return {
      dirtyToken: props.token,
      createdToken: null
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && !this.props.isSaving) {
      this.setState(this.getStateFromProps(nextProps));
    }
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
            {!this.props.isEditting ? 'Create token' : `Token ${this.props.token.get('description')}(${this.props.token.get('id')})`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TokenEditor
            disabled={this.isInputDisabled()}
            isEditting={this.props.isEditting}
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
            isDisabled={!this.isValid() || this.props.token === this.state.dirtyToken || !!this.state.createdToken}
            isSaving={this.props.isSaving}
            onSave={this.handleSave}
            onCancel={this.handleClose}
            placement="right"
            cancelLabel={!!this.state.createdToken ? 'Close' : 'Cancel'}
            saveLabel={this.props.isEditting ? 'Update' : 'Create'}
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
      if (this.props.isEditting) {
        return this.handleClose();
      }
      this.setState({createdToken: token, dirtyToken: token});
    });
  },

  handleClose() {
    this.props.onHideFn();
  }

});
