import React from 'react';
import { DropdownMenu } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <DropdownMenu {...this.props} />
    );
  }
});
