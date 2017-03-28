import React from 'react';
import { Grid } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Grid {...this.props} />
    );
  }
});
