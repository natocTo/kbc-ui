import React from 'react';
import { TabbedArea } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <TabbedArea {...this.props} />
    );
  }
});
