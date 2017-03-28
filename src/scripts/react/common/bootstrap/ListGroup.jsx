import React from 'react';
import { ListGroup } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <ListGroup {...this.props} />
    );
  }
});
