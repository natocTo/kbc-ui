import React, {PropTypes} from 'react';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      dimensions: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {value, onChange, disabled} = this.props;
    return (
      <form>
        <FormGroup>
          <ControlLabel>Dimensions</ControlLabel>
          <FormControl
            type="text"
            disabled={disabled}
            onChange={e => onChange({dimensions: e.target.value})}
            value={value.dimensions}
          />
        </FormGroup>
      </form>
    );
  }
});
