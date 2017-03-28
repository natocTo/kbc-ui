import React from 'react';
import { Interpolate } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Interpolate {...this.props} />
    );
  }
});
