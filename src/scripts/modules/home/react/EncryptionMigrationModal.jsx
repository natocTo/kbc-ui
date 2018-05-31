import React from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Promise from 'bluebird';
import installedComponentsApi from '../../components/InstalledComponentsApi';

// import SqlDepAnalyzerApi from '../../../sqldep-analyzer/Api';
// import { ExternalLink } from '@keboola/indigo-ui';
// import Result from '../components/validation/Result';
// import Immutable from 'immutable';

export default React.createClass({
  propTypes: {
    configurations: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool.isRequired,
    onHide: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      isProcessing: false,
      isFinished: false
    };
  },

  onHide() {
    this.setState({
      isProcessing: false,
      isFinished: false
    });
    return this.props.onHide();
  },

  migrateConfiguration(componentId, configurationId) {
    installedComponentsApi.getConfig(componentId, configId).then((configuration) => {
       
    })
  }

  onRun() {
    this.setState({
      isProcessing: true
    });
    var promises = [];
    this.props.configurations.forEach((configuration, key) => {
      promises.push(this.migrateConfiguration(key, configuration.get('id')))
    });

    return Promise.all(promises);
    /*
    return SqlDepAnalyzerApi
      .validate(this.props.bucketId, this.props.transformationId)
      .then((response) => {
        return this.setState({
          isLoading: false,
          result: Immutable.fromJS(response)
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
        throw error;
      });
    */
  },

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.onHide}
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Migrate Encryption</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderBody()}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              onClick={this.onHide}
              disabled={this.state.isProcessing || this.state.isFinished}
              bsStyle="link"
            >Close</Button>
            <Button
              onClick={this.onRun}
              className="btn-primary"
              disabled={this.state.isProcessing || this.state.isFinished}
            >
              {this.state.isLoading ? 'Migrating' : 'Migrate'}
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  },

  renderResult() {
    if (!this.state.isFinished) {
      return;
    }
    return 'All configurations migrated. Please reload your browser.';
  },

  renderBody() {
    return (
      <span>
        <p>
          A new version of all affected configurations will be created, only the encrypted content will be changed.
        </p>
        <p>
          {this.renderResult()}
        </p>
      </span>
    );
  }
});
