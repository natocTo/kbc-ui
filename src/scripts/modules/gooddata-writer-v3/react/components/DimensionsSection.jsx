import React, {PropTypes} from 'react';
const TitleSection = ({value, onChange, disabled}) =>(
  <span>
    <input disabled={disabled} onChange={e => onChange({dimensions: e.target.value})}
      value={value.dimensions} />
  </span>
);

TitleSection.propTypes = {
  value: PropTypes.shape({
    dimensions: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default TitleSection;
