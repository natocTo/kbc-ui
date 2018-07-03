import React, {PropTypes} from 'react';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      name: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {value, onChange, disabled} = this.props;
    return (
      <form>
        <FormGroup>
          <ControlLabel>BigQuery Name</ControlLabel>
          <FormControl

            type="text"
            disabled={disabled}
            onChange={e => onChange({name: e.target.value})}
            value={value.name}
          />
        </FormGroup>
      </form>
    );
  }
});
