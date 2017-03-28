import React from 'react';
import { Overlay } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Overlay {...this.props} />
    );
  }
});
