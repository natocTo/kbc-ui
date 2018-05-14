import React, { PropTypes } from 'react';

const LoadTypeSectionTitle = ({ value }) => (
  <span> Load Type: {value.incrementalLoad === 0 ? 'Full Load' : 'Incremental Load'} </span>
);

LoadTypeSectionTitle.propTypes = {
  value: PropTypes.object
};

export default LoadTypeSectionTitle;
