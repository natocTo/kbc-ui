import _ from 'underscore';
import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import { Button, ButtonToolbar, Modal, Input } from './../../../react/common/KbcBootstrap';
import RouterStore from '../../../stores/RoutesStore';

export default React.createClass({

  displayName: 'DropboxAuthorizeModal',

  propTypes: {
    configId: React.PropTypes.string.isRequired,
    redirectRouterPath: React.PropTypes.string,
    credentialsId: React.PropTypes.string,
    renderOpenButtonAsLink: React.PropTypes.bool
  },

  getInitialState() {
    let oauthUrl = 'https://syrup.keboola.com/oauth/auth20';

    return {
      description: '',
      token: ApplicationStore.getSapiTokenString(),
      oauthUrl: oauthUrl,
      router: RouterStore.getRouter(),
      showModal: false
    };
  },

  close() {
    this.setState({
      showModal: false
    });
  },

  open() {
    this.setState({
      showModal: true
    });
  },

  getDefaultProps() {
    return {
      redirectRouterPath: 'ex-dropbox-oauth-redirect',
      renderOpenButtonAsLink: false
    };
  },

  eventChange(event) {
    this.setState({
      description: event.target.value
    });
  },

  render() {
    return (
      <div>
        { this.renderOpenButton() }
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Authorize Dropbox Account</Modal.Title>
          </Modal.Header>
          <form className="form-horizontal" action={this.state.oauthUrl} method="POST">
            {this.createHiddenInput('api', 'ex-dropbox')}
            {this.createHiddenInput('id', this.props.credentialsId || this.props.configId )}
            {this.createHiddenInput('token', this.state.token)}
            {this.createHiddenInput('returnUrl', this.getRedirectUrl())}

            <Modal.Body>
              <Input
                label="Dropbox Email"
                type="text"
                ref="description"
                name="description"
                help="Used afterwards as a description of the authorized account"
                labelClassName="col-xs-3"
                wrapperClassName="col-xs-9"
                defaultValue={this.state.description}
                onChange={this.eventChange}
                autoFocus={true}
              />
            </Modal.Body>
            <Modal.Footer>
              <ButtonToolbar>
                <Button
                  bsStyle="link"
                  onClick={this.close}>Cancel
                </Button>
                <Button
                  bsStyle="success"
                  type="submit"
                  disabled={_.isEmpty(this.state.description)}
                ><span><i className="fa fa-fw fa-dropbox" />Authorize</span>
                </Button>
              </ButtonToolbar>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  },

  renderOpenButton() {
    if (this.props.renderOpenButtonAsLink) {
      return (
        <Button bsStyle="link" onClick={this.open}>
          <i className="fa fa-fw fa-user" /> Authorize Dropbox Account
        </Button>
      );
    } else {
      return (
        <Button bsStyle="success" onClick={this.open}>
          <i className="fa fa-fw fa-dropbox" /> Authorize Dropbox Account
        </Button>
      );
    }
  },

  createHiddenInput(name, value) {
    return (
      <input
        name={name}
        type="hidden"
        value={value}
      />

    );
  },

  getRedirectUrl() {
    let origin = ApplicationStore.getSapiUrl();
    let url = this.state.router.makeHref(this.props.redirectRouterPath, {config: this.props.configId});
    let result = `${origin}${url}`;

    return result;
  }
});
