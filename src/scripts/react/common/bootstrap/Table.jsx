import React from 'react';
import { Table } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Table {...this.props} />
    );
  }
});
