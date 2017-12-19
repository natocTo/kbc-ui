import React from 'react';

const createClassTemplate = (componentId) => ({
  render() {
    return <div>WR DB {componentId} GENERIC CREDENTIALS </div>;
  }
});

export default (componentId) => React.createClass(createClassTemplate(componentId));
