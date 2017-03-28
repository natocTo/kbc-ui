import React from 'react';
import { Row } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Row {...this.props} />
    );
  }
});
