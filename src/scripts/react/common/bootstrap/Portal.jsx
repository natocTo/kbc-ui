import React from 'react';
import { Portal } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Portal {...this.props} />
    );
  }
});
