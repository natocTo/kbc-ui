import React from 'react';
import { Accordion } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Accordion {...this.props} />
    );
  }
});
