import React, {PropTypes} from 'react';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      dimensions: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
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
        <div>
          <button
            disabled={this.props.disabled}
            onClick={this.saveDoubled}
            className="btn btn-success">
            Double and Save
          </button>
        </div>
      </form>
    );
  },

  saveDoubled(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSave({dimensions: this.props.value.dimensions + this.props.value.dimensions});
  }
});
