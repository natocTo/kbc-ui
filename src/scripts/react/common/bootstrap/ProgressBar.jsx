import React from 'react';
import { ProgressBar } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <ProgressBar {...this.props} />
    );
  }
});
