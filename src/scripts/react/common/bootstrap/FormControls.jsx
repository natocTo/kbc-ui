import React from 'react';
import { FormControls } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <FormControls {...this.props} />
    );
  }
});
