import React, {PropTypes} from 'react';
const TitleSection = ({value, onChange, disabled}) =>(
    <span>
      <input disabled={disabled} onChange={e => onChange({identifier: e.target.value})}
        value={value.identifier} />
      <input disabled={disabled} onChange={e => onChange({title: e.target.value})} />
    </span>
  );

TitleSection.propTypes = {
  value: PropTypes.shape({
    title: PropTypes.string,
    identifier: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default TitleSection;
