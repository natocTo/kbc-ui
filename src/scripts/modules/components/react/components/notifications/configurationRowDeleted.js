import React from 'react';

export default (row, changeDescription) => {
  const message = changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled' ) + ' was deleted.');
  return React.createClass({
    render: function() {
      return (
        <span>
          {message}
        </span>
      );
    }
  });
};
