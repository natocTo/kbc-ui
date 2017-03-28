import React from 'react';
import { Nav } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Nav {...this.props} />
    );
  }
});
