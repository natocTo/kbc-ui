import React from 'react';
import { Alert } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Alert {...this.props} />
    );
  }
});
