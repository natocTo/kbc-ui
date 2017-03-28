import React from 'react';
import { ButtonToolbar } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <ButtonToolbar {...this.props} />
    );
  }
});
