import React from 'react';
import Modal from './Modal';
import { filesize } from '../../../utils/utils';

export default React.createClass({
  propTypes: {
    file: React.PropTypes.object
  },

  getInitialState() {
    return {
      isModalOpen: false
    };
  },

  render() {
    const {file} = this.props;
    return (
      <a onClick={this.openModal}>
        {file.get('name')} ({filesize(file.get('sizeBytes'))})
        <Modal
          file={file}
          isModalOpen={this.state.isModalOpen}
          onModalHide={this.closeModal}
        />
      </a>
    );
  },

  openModal() {
    this.setState({
      isModalOpen: true
    });
  },

  closeModal() {
    this.setState({
      isModalOpen: false
    });
  }

});
