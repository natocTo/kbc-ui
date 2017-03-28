import React from 'react';
import { PageHeader } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <PageHeader {...this.props} />
    );
  }
});
