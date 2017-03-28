import React from 'react';
import { TabPane } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <TabPane {...this.props} />
    );
  }
});
