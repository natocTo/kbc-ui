import React from 'react';
import { Thumbnail } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Thumbnail {...this.props} />
    );
  }
});
