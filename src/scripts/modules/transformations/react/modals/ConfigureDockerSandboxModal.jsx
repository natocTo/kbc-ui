import React, {PropTypes} from 'react';
// import {Input} from './../../../../react/common/KbcBootstrap';
import {Modal} from 'react-bootstrap';
import {Link} from 'react-router';
// import RadioGroup from 'react-radio-group';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';

export default React.createClass({
  propTypes: {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    transformationType: PropTypes.string.isRequired,
    progress: PropTypes.string,
    progressStatus: PropTypes.string,
    isRunning: PropTypes.bool,
    isCreated: PropTypes.bool,
    jobId: PropTypes.string,
    jupyterCredentials: PropTypes.object.isRequired,
    onCreateStart: PropTypes.func.isRequired
  },

  render() {
    return (
      <Modal show={this.props.show} bsSize="large" onHide={this.props.onHide} enforceFocus={false}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Create sandbox</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderCredentials()}
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-left" style={{padding: '6px 12px'}}>
            <span className={'text-' + this.props.progressStatus}>
              {this.renderStatusIcon()} {this.props.progress}
              <span />
              {this.props.jobId ? <Link to="jobDetail" params={{jobId: this.props.jobId}}>More details</Link> : null}
            </span>
          </div>
          <ConfirmButtons
            onCancel={this.props.onHide}
            onSave={this.props.onCreateStart}
            saveLabel={'Create'}
            cancelLabel={'Close'}
            isSaving={this.props.isRunning}
            showSave={!this.props.isCreated}
            isDisabled={!this.hasCredentials()}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  renderStatusIcon() {
    if (this.props.progressStatus === 'success') {
      return (
        <span className="fa fa-check"/>
      );
    } else if (this.props.progressStatus === 'danger') {
      return (
        <span className="fa fa-times"/>
      );
    } else {
      return null;
    }
  },

  hasCredentials() {
    return this.props.jupyterCredentials.has('id');
  },

  renderCredentials() {
    return (
      <div className="clearfix">
        <h3>Credentials</h3>
        <div className="col-sm-offset-1 col-sm-10">
          {this.renderJupyterCredentials()}
        </div>
      </div>
    );
  },

  renderJupyterCredentials() {
    return (
      <div className="row">
        <div className="col-md-9">
          todo
        </div>
        <div className="col-md-3">
          {this.renderJupyterConnect()}
        </div>
      </div>
    );
  },

  renderJupyterConnect() {
    if (!this.props.jupyterCredentials.get('id')) {
      return null;
    }
    return (
      <div>
        <a href={'https://' + this.props.jupyterCredentials.get('hostname') + '/console/login#/?returnUrl=sql/worksheet'} target="_blank" className="btn btn-link">
          <span className="fa fa-fw fa-database" />
          <span> Connect</span>
        </a>
      </div>
    );
  }


});
