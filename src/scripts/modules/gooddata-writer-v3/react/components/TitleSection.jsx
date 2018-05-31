import React, {PropTypes} from 'react';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      title: PropTypes.string,
      identifier: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {value, onChange, disabled} = this.props;
    return (
      <form>
        <FormGroup>
          <ControlLabel>Identifier</ControlLabel>
          <FormControl

            type="text"
            disabled={disabled}
            onChange={e => onChange({identifier: e.target.value})}
            value={value.identifier}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            disabled={disabled}
            onChange={e => onChange({title: e.target.value})}
            value={value.title}
          />
        </FormGroup>
      </form>
    );
  }
});
