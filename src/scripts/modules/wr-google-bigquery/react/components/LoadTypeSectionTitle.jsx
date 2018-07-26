import React, { PropTypes } from 'react';

const LoadTypeSectionTitle = ({ value }) => (
  <span>
    <strong>Load Type</strong>: {value.incremental === false ? 'Full Load' : 'Incremental Load'}
  </span>
);

LoadTypeSectionTitle.propTypes = {
  value: PropTypes.object
};

export default LoadTypeSectionTitle;
