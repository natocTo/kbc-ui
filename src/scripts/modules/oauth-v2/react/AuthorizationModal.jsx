import React, {PropTypes} from 'react';
import InstantAuthorizationFields from './InstantAuthoriationFields';
import {TabbedArea, TabPane, ButtonToolbar, Button, Modal} from 'react-bootstrap';
import Clipboard from '../../../react/common/Clipboard';
import AuthorizationForm from './AuthorizationForm';
import DirectTokenInsertFields from './DirectTokenInsertFields';
import * as oauthUtils from '../OauthUtils';
import {Loader} from 'kbc-react-components';

import './AuthorizationModal.less';

export default React.createClass({
  propTypes: {
    componentId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    configId: PropTypes.string.isRequired,
    show: PropTypes.bool,
    onHideFn: PropTypes.func
  },

  getInitialState() {
    return {
      direct: {},
      isFormValid: false,
      externalLink: '',
      generatingLink: false,
      activeTab: 'general'
    };
  },

  render() {
    return (
      <div className="static-modal">
        <Modal
          className="kbc-authorization-modal"
          show={this.props.show}
          onHide={this.props.onHideFn}
          enforceFocus={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Authorize
            </Modal.Title>
          </Modal.Header>
          <AuthorizationForm
            componentId={this.props.componentId}
            id={this.props.id}
          >
            <Modal.Body>
              <TabbedArea key="tabbedarea" activeKey={this.state.activeTab} onSelect={this.goToTab} animation={false}>
                <TabPane key="general" eventKey="general" tab="Instant authorization">
                  {this.renderInstant()}
                </TabPane>
                <TabPane key="external" eventKey="external" tab="External authorization">
                  {this.renderExternal()}
                </TabPane>
                <TabPane key="direct" eventKey="direct" tab="Direct token insert">
                  {this.renderDirectTokenInsert()}
                </TabPane>

              </TabbedArea>
            </Modal.Body>
            <Modal.Footer>
              {this.renderFooterButtons()}
            </Modal.Footer>
          </AuthorizationForm>
        </Modal>
      </div>
    );
  },

  renderFooterButtons() {
    if (this.state.activeTab === 'general') return this.renderInstantButtons();
    if (this.state.activeTab === 'external') return this.renderExternalButtons();
    if (this.state.activeTab === 'direct') return this.renderDirectButtons();
  },

  renderExternal() {
    const externalLink = (
      this.state.externalLink ?
      <pre>
        <a href={this.state.externalLink} target="_blank">
          {this.state.externalLink}
        </a>
        <div style={{paddingTop: '10px'}}>
          <Clipboard text={this.state.externalLink} label="Copy link to clipboard" />
        </div>
      </pre>
      : null
    );
    return (
      <div>
        <p style={{marginTop: '20px'}}>
          <span>
            To authorize an account from a non-Keboola Connection user, generate a link to the external authorization app and send it to the user you want to have the authorized account for. The generated link is valid for <strong>48</strong> hours and will not be stored anywhere.
          </span>
        </p>
        {externalLink}
      </div>
    );
  },

  onGetExternalLink() {
    this.setState({generatingLink: true});
    oauthUtils
      .generateLink(this.props.componentId, this.props.configId)
      .then((link) => {
        this.setState({generatingLink: false, externalLink: link});
      });
  },

  onSaveDirectToken() {
    const {direct} = this.state;
    this.setDirectState('saving', true);
    oauthUtils.saveDirectToken(this.props.componentId, this.props.configId, direct.token, direct.authorizedFor).then(() => {
      this.setState(this.getInitialState());
      this.props.onHideFn();
    });
  },

  isDirectTokenFormValid() {
    const {direct} = this.state;
    return !!direct.token && !!direct.authorizedFor;
  },

  renderDirectButtons() {
    const {direct} = this.state;
    return (
      <ButtonToolbar>
        {(direct.saving ? <Loader /> : null)}
        <Button
          disabled={direct.saving}
          bsStyle="link"
          onClick={this.props.onHideFn}>Cancel
        </Button>
        <Button
          bsStyle="success"
          onClick={this.onSaveDirectToken}
          type="button"
          disabled={!this.isDirectTokenFormValid() || direct.saving}
        >Save
        </Button>
      </ButtonToolbar>
    );
  },

  setDirectState(prop, value) {
    const {direct} = this.state;
    direct[prop] = value;
    this.setState({'direct': direct});
  },

  renderDirectTokenInsert() {
    const {direct} = this.state;
    return (
      <DirectTokenInsertFields
        token={direct.token}
        authorizedFor={direct.authorizedFor}
        onChangeProperty={this.setDirectState}
        componentId={this.props.componentId}
      />
    );
  },

  renderInstant() {
    return (
      <InstantAuthorizationFields
        componentId={this.props.componentId}
        setFormValidFn={(newValue) => this.setState({isFormValid: newValue})}
      />
    );
  },

  renderInstantButtons() {
    return (
      <ButtonToolbar>
        <Button
          bsStyle="link"
          onClick={this.props.onHideFn}>Cancel
        </Button>
        <Button
          bsStyle="success"
          type="submit"
          disabled={!this.state.isFormValid}
        ><span>Authorize</span>
        </Button>
      </ButtonToolbar>
    );
  },

  renderExternalButtons() {
    return (
      <ButtonToolbar>
        {(this.state.generatingLink ? <Loader /> : null)}
        <Button
          bsStyle="link"
          onClick={this.props.onHideFn}>Cancel
        </Button>
        <Button
          type="button"
          disabled={this.state.generatingLink}
          bsStyle="success"
          onClick={this.onGetExternalLink}>
          {(this.state.externalLink ? 'Regenerate Link' : 'Generate Link')}
        </Button>
      </ButtonToolbar>
    );
  },

  goToTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

});
