import React from 'react';
import { Carousel } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Carousel {...this.props} />
    );
  }
});
