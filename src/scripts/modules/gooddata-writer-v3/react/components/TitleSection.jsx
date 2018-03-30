import React, {PropTypes} from 'react';
const TitleSection = ({value, onChange, disabled}) => (
  <span>
    <div> title
      <input type="text" disabled={disabled} onChange={e => onChange({identifier: e.target.value})}
        value={value.identifier} />
    </div>
    <div> identifier
      <input disabled={disabled} onChange={e => onChange({title: e.target.value})} />
    </div>
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
