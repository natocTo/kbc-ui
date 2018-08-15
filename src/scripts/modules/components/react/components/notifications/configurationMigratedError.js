import React from 'react';

export default () => {
  return React.createClass({
    render: function() {
      return (
        <span>
          Migration encountered an error. Please rollback to previous version and try again.
        </span>
      );
    }
  });
};

