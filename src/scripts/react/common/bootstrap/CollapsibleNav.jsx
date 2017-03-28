import React from 'react';
import { CollapsibleNav } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <CollapsibleNav {...this.props} />
    );
  }
});
