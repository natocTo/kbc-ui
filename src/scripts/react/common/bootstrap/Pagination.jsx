import React from 'react';
import { Pagination } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Pagination {...this.props} />
    );
  }
});
