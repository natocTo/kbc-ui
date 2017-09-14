import React from 'react';

import ConfigurationCopiedNotification
  from '../../../../components/react/components/ConfigurationCopiedNotification';

export default (bucketId, bucketName) => {
  return React.createClass({
    propTypes: {
      onClick: React.PropTypes.func.isRequired
    },
    render: function() {
      return React.createElement(ConfigurationCopiedNotification, {
        message: 'Bucket ' + bucketName + ' was ',
        linkLabel: 'restored',
        componentId: 'transformation',
        configId: bucketId,
        onClick: this.props.onClick
      });
    }
  });
};
