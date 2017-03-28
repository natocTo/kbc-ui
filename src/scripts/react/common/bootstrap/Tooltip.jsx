import React from 'react';
import { Tooltip } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Tooltip {...this.props} />
    );
  }
});
