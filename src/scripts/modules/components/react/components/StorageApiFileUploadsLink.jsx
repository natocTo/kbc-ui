import React from 'react';
import ApplicationStore from '../../../../stores/ApplicationStore';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },

  fileUploadsUrl() {
    return ApplicationStore.getSapiFileUploadsUrl();
  },

  render() {
    return (
      <a
        target="_blank"
        href={this.fileUploadsUrl()}
        onClick={(e) => e.stopPropagation()}
      >{this.props.children}</a>
    );
  }
});
