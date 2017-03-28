import React from 'react';
import { PanelGroup } from 'react-bootstrap';

export default React.createClass({
  render() {
    return (
      <PanelGroup {...this.props} />
    );
  }
});
