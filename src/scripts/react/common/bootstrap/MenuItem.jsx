import React from 'react';
import { MenuItem } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <MenuItem {...this.props} />
    );
  }
});
