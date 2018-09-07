import React from 'react';
import ComponentsStore from '../../components/stores/ComponentsStore';
import RoutesStore from '../../../stores/RoutesStore';
import ApplicationStore from '../../../stores/ApplicationStore';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Input } from '../../../react/common/KbcBootstrap';
import { Loader } from '@keboola/indigo-ui';

export default React.createClass({
  propTypes: {
    componentName: React.PropTypes.string.isRequired,
    isGeneratingExtLink: React.PropTypes.bool.isRequired,
    extLink: React.PropTypes.object,
    refererUrl: React.PropTypes.string.isRequired,
    generateExternalLinkFn: React.PropTypes.func.isRequired,
    sendEmailFn: React.PropTypes.func.isRequired,
    sendingLink: React.PropTypes.bool,
    isExtLinkOnly: React.PropTypes.bool,
    isInstantOnly: React.PropTypes.bool,
    renderToForm: React.PropTypes.bool,
    noConfig: React.PropTypes.bool,
    caption: React.PropTypes.string,
    children: React.PropTypes.any
  },

  getDefaultProps() {
    return {
      isInstantOnly: false,
      noConfig: false, // if has kbc config
      caption: 'Authorize Google Account now',
      renderToForm: false
    };
  },

  getInitialState() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const token = ApplicationStore.getSapiTokenString();
    const currentUserEmail = ApplicationStore.getCurrentAdmin().get('email');
    return {
      component: ComponentsStore.getComponent(this.props.componentName),
      configId,
      token,
      currentUserEmail,
      defaultActiveKey: this.props.isExtLinkOnly ? 'external' : 'instant'
    };
  },

  render() {
    if (this.props.renderToForm) {
      return this._renderToForm();
    }

    return (
      <div className="container-fluid">
        <div className="kbc-main-content">
          <Tabs defaultActiveKey={this.state.defaultActiveKey} animation={false} className="tabs-inside-modal">
            {!this.props.isExtLinkOnly && (
              <Tab eventKey="instant" title="Instant Authorization">
                <form className="form-horizontal" action={this._getOAuthUrl()} method="POST">
                  <div className="row">
                    <div className="well">{this.props.caption}</div>
                    {this._createHiddenInput('token', this.state.token)}
                    {!this.props.noConfig && this._createHiddenInput('account', this.state.configId)}
                    {this._createHiddenInput('referrer', this._getReferrer())}
                    {this.props.noConfig && this._createHiddenInput('external', '1')}
                    <Button className="btn btn-primary" type="submit">
                      {this.props.caption}
                    </Button>
                  </div>
                </form>
              </Tab>
            )}

            {!this.props.isInstantOnly && (
              <Tab eventKey="external" title="External Authorization">
                <form className="form-horizontal">
                  <div className="row">
                    <div className="well">
                      Generated external link allows to authorize the Google account without having an access to the
                      KBC. The link is temporary valid and expires 48 hours after the generation.
                    </div>
                    {this.props.extLink && this._renderExtLink()}
                  </div>
                  <div className="row">
                    <div className="kbc-buttons">
                      <Button
                        className="btn btn-primary"
                        onClick={this._generateExternalLink}
                        disabled={this.props.isGeneratingExtLink}
                        type="button"
                      >
                        {this.props.extLink ? 'Regenerate External Link' : 'Generate External Link'}
                      </Button>
                      <span> {this.props.isGeneratingExtLink && <Loader />}</span>
                    </div>
                  </div>
                </form>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    );
  },

  _renderToForm() {
    return (
      <form className="form-horizontal" action={this._getOAuthUrl()} method="POST">
        {this._createHiddenInput('token', this.state.token)}
        {!this.props.noConfig && this._createHiddenInput('account', this.state.configId)}
        {this._createHiddenInput('referrer', this._getReferrer())}
        {this.props.noConfig && this._createHiddenInput('external', '1')}
        {this.props.children}
      </form>
    );
  },

  _renderExtLink() {
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label className="col-sm-3 control-label">External Authorization Link:</label>
          <div className="col-sm-9">
            <pre className="form-control-static">{this.props.extLink.get('link')}</pre>
          </div>
        </div>
        {this.props.sendEmailFn && (
          <span>
            <Input
              wrapperClassName="col-sm-9"
              labelClassName="col-sm-3"
              label="Email Link To:"
              type="email"
              value={this.state.email}
              placeholder="email address of the recipient"
              onChange={event => {
                return this.setState({
                  email: event.target.value
                });
              }}
            />
            <div className="form-group">
              <label className="col-sm-3 control-label">Message(optional):</label>
              <div className="col-sm-9">
                <textarea
                  className="form-control"
                  value={this.state.message}
                  placeholder="message for the link recipient"
                  onChange={event => {
                    return this.setState({
                      message: event.target.value
                    });
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-4">
                <Button
                  bsStyle="primary"
                  disabled={!this.state.email || this.props.sendingLink}
                  onClick={() => {
                    return this.props.sendEmailFn(
                      this.state.currentUserEmail,
                      this.state.email,
                      this.state.message,
                      this.props.extLink.get('link')
                    );
                  }}
                >
                  Send Email
                </Button>
                <span> {this.props.sendingLink && <Loader />}</span>
              </div>
            </div>
          </span>
        )}
      </div>
    );
  },

  _generateExternalLink() {
    return this.props.generateExternalLinkFn();
  },

  _getOAuthUrl() {
    const endpoint = this.state.component.get('uri');
    return `${endpoint}/oauth`;
  },

  _getReferrer() {
    return this.props.refererUrl;
  },

  _createHiddenInput(name, value) {
    return <input name={name} type="hidden" value={value} />;
  }
});
