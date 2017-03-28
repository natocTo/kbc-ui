import React from 'react';
import { Navbar } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Navbar {...this.props} />
    );
  }
});
