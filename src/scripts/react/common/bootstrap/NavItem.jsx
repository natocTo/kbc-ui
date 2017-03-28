import React from 'react';
import { NavItem } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <NavItem {...this.props} />
    );
  }
});
