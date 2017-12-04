import React from 'react';

export default (row) => {
  return React.createClass({
    render: function() {
      return (
        <span>
          Row {row.get('name') !== '' ? row.get('name') : 'Untitled' } was deleted.
        </span>
      );
    }
  });
};
