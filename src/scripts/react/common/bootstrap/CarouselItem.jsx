import React from 'react';
import { CarouselItem } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <CarouselItem {...this.props} />
    );
  }
});
