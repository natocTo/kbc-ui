import React from 'react';

const createClassTemplate = (componentId) => ({
  render() {
    return <div>WR DB {componentId} GENERIC TABLE DETAIL</div>;
  }
});

export default (componentId) => React.createClass(createClassTemplate(componentId));
