import React from 'react';
import { filesize } from '../../../utils/utils';
import ModalHandler from '../sliced-files-downloader/ModalHandler';

export default React.createClass({
  propTypes: {
    file: React.PropTypes.object
  },

  render() {
    const {file} = this.props;
    return file.get('isSliced') ?
      this.renderSlicedFileDownloadModalTrigger(file) :
      this.renderSimpleDownloadLink(file);
  },

  renderSlicedFileDownloadModalTrigger(file) {
    return (
      <ModalHandler file={file}/>
    );
  },

  renderSimpleDownloadLink(file) {
    return (
      <a href={file.get('url')}>
        {file.get('name')} ({filesize(file.get('sizeBytes'))})
      </a>
    );
  }

});