import React, { PropTypes } from 'react';

export default React.createClass({

  propTypes: {
    documentationUrl: PropTypes.string.isRequired
  },

  render() {
    return (
      <p className="small">
        {'For more information about configuring MongoDB Extractor follow guide at '}
         <a href={this.props.documentationUrl} target="_blank">https://help.keboola.com</a>.
      </p>
    );
  }
});
