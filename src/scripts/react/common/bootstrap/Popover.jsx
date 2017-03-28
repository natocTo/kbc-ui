import React from 'react';
import { Popover } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Popover {...this.props} />
    );
  }
});
