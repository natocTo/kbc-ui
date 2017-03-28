import React from 'react';
import { Input } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Input {...this.props} />
    );
  }
});
