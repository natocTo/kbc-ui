import React from 'react';
import { Pager } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Pager {...this.props} />
    );
  }
});
