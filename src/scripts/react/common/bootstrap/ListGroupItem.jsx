import React from 'react';
import { ListGroupItem } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <ListGroupItem {...this.props} />
    );
  }
});
