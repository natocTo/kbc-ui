import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import { filesize } from '../../../utils/utils';

export default React.createClass({
  propTypes: {
    isModalOpen: React.PropTypes.bool,
    onModalHide: React.PropTypes.func,
    onPrepareStart: React.PropTypes.func,
    file: React.PropTypes.object,
    createdFile: React.PropTypes.object,
    isRunning: React.PropTypes.bool,
    progress: React.PropTypes.string,
    progressStatus: React.PropTypes.string
  },

  render() {
    return (
      <Modal show={this.props.isModalOpen} onHide={this.props.onModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            Sliced File Download
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>File <strong>{this.props.file.get('name')} ({filesize(this.props.file.get('sizeBytes'))})</strong> is sliced into multiple chunks.</p>
          <p>All chunks will be packed into <code>ZIP</code> file, you will be given link to download the file.</p>
        </Modal.Body>
        <Modal.Footer>
          {this.renderStatusBar()}
          {this.props.createdFile ?
            <div className="kbc-buttons">
              <Button
                bsStyle="link"
                onClick={this.props.onModalHide}>
                Close
              </Button>
              <a href={this.props.createdFile.get('url')} target="_blank" className="btn btn-success">
                Download
              </a>
            </div>
            :
            <ConfirmButtons
              onCancel={this.props.onModalHide}
              onSave={this.props.onPrepareStart}
              saveLabel={'Prepare Package'}
              cancelLabel={'Close'}
              isSaving={this.props.isRunning}
            />
          }

        </Modal.Footer>
      </Modal>
    );
  },

  renderStatusBar() {
    if (!this.props.progress) {
      return null;
    }
    return (
      <div className="pull-left" style={{padding: '6px 15px'}}>
         <span className={'text-' + this.props.progressStatus}>
           {this.renderStatusIcon(this.props.progressStatus)} {this.props.progress}
           <span />
         </span>
      </div>
    );
  },

  renderStatusIcon(progressStatus) {
    if (progressStatus === 'success') {
      return (
        <span className="fa fa-check"/>
      );
    } else if (progressStatus === 'danger') {
      return (
        <span className="fa fa-times"/>
      );
    } else {
      return null;
    }
  }
});