import React from 'react';
import { Link } from 'react-router';

export default (bucket, restoreTransformationBucketFn) => {
  return React.createClass({
    propTypes: {
      onClick: React.PropTypes.func.isRequired
    },
    revertConfigRemove: function() {
      restoreTransformationBucketFn(bucket);
      return this.props.onClick();
    },
    render: function() {
      return React.DOM.span(null, 'Bucket ' + (bucket.get('name')) + ' was moved to ',
        React.createElement(Link, {
          to: 'settings-trash',
          onClick: this.props.onClick
        }, 'Trash'), '. ', React.DOM.a({
          onClick: this.revertConfigRemove
        }, 'Revert'));
    }
  });
};
