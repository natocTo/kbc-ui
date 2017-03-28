import React from 'react';
import { Jumbotron } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <Jumbotron {...this.props} />
    );
  }
});
