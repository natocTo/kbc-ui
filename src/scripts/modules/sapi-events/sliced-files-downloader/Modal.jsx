import React from 'react';
import {Modal} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    isModalOpen: React.PropTypes.bool,
    onModalHide: React.PropTypes.func,
    file: React.PropTypes.object
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
          <p>File <strong>{this.props.file.get('name')}<strong> is sliced into multiple chunks.</p>
          <p>All chunks will be packed into <code>ZIP</code> file, and when the export is finished, you will be given link to download the file.</p>
        </Modal.Body>
        <Modal.Footer>
          todo
        </Modal.Footer>
      </Modal>
    );
  }
});