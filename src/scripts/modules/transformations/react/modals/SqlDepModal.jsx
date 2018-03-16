
import React from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonToolbar, Button } from 'react-bootstrap';
import SqlDepAnalyzerApi from '../../../sqldep-analyzer/Api';

export default React.createClass({
  displayName: 'SqlDepModal',

  propTypes: {
    transformationId: React.PropTypes.string.isRequired,
    bucketId: React.PropTypes.string.isRequired,
    backend: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      isLoading: false,
      sqlDepUrl: null,
      showModal: false
    };
  },

  close() {
    return this.setState({
      showModal: false,
      isLoading: false,
      sqlDepUrl: null
    });
  },

  onRun() {
    this.setState({
      isLoading: true
    });
    const component = this;
    return SqlDepAnalyzerApi
      .getGraph(this.props.bucketId, this.props.transformationId)
      .then(function(response) {
        return component.setState({
          isLoading: false,
          sqlDepUrl: response.url
        });
      }).catch(function(error) {
        component.setState({
          isLoading: false
        });
        throw error;
      });
  },

  open() {
    this.setState({
      showModal: true
    });
  },

  betaWarning() {
    if (this.props.backend === 'snowflake') {
      return (
        <span>{' '}
          <span className="label label-info">BETA</span>
        </span>
      );
    }
  },

  render() {
    return (
      <a onClick={this.handleOpenButtonClick}>
        <i className="fa fa-sitemap fa-fw" />
        {' '}SQLdep
        {this.betaWarning()}
        <Modal
          show={this.state.showModal}
          onHide={this.close}
        >
          <Modal.Header closeButton={true}>
            <Modal.Title>SQLdep</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderBody()}
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button onClick={this.close} bsStyle="link">Close</Button>
              <Button
                onClick={this.onRun}
                className="btn-primary"
                disabled={this.state.isLoading || !!this.state.sqlDepUrl}
              >
                {this.state.isLoading ? 'Running' : 'Run'}
              </Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </a>
    );
  },

  handleOpenButtonClick(e) {
    e.preventDefault();
    return this.open();
  },

  renderSqlDepUrl() {
    if (this.state.sqlDepUrl) {
      return (
        <span>
          <p>
            SQLdep is ready at <a href={this.state.sqlDepUrl} target="_blank">{this.state.sqlDepUrl}</a>.
          </p>
        </span>
      );
    }
  },
  renderBody() {
    if (this.props.backend === 'redshift' || this.props.backend === 'snowflake') {
      return (
        <span>
          <p>
            Visual SQL analysis will send the SQL queries (including comments) and table details to
            {' '}<a href="https://sqldep.com/">SQLdep API</a>.
            Although the URL will be only available to you, the result is not secured any further.
          </p>
          {this.renderSqlDepUrl()}
        </span>
      );
    } else {
      return (
        <p>Visual SQL analysis is available for Snowflake and Redshift transformations only.</p>
      );
    }
  }
});
