import React from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonToolbar, Button } from 'react-bootstrap';
import SqlDepAnalyzerApi from '../../../sqldep-analyzer/Api';

export default React.createClass({
  propTypes: {
    transformationId: React.PropTypes.string.isRequired,
    bucketId: React.PropTypes.string.isRequired,
    backend: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool.isRequired,
    onHide: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      isLoading: false,
      sqlDepUrl: null
    };
  },

  onHide() {
    this.setState({
      isLoading: false,
      sqlDepUrl: null
    });
    return this.props.onHide();
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

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.onHide}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>SQLdep</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderBody()}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button onClick={this.onHide} bsStyle="link">Close</Button>
            <Button
              onClick={this.onRun}
              className="btn-primary"
              disabled={this.state.isLoading || !!this.state.sqlDepUrl || !this.isValidBackend()}
            >
              {this.state.isLoading ? 'Running' : 'Run'}
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
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
    if (this.isValidBackend()) {
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
  },

  isValidBackend() {
    if (this.props.backend === 'redshift' || this.props.backend === 'snowflake') {
      return true;
    }
    return false;
  }
});
