import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <OverlayTrigger {...this.props} />
    );
  }
});
