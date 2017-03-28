import React from 'react';
import { ButtonGroup } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <ButtonGroup {...this.props} />
    );
  }
});
