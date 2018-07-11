import React, {PropTypes} from 'react';
import {Radio, HelpBlock, FormGroup, ControlLabel} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      incrementalLoad: PropTypes.number.isRequired,
      grain: PropTypes.object
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {value, onChange, disabled} = this.props;
    return (
      <form>
        <FormGroup>
          <ControlLabel>Load type</ControlLabel>
          <Radio
            type="radio"
            title="Full Load"
            disabled={disabled}
            onChange={() => onChange({incrementalLoad: 0})}
            checked={value.incrementalLoad === 0}>
            Full Load
          </Radio>
          <HelpBlock>
            All Data in GoodData dataset will be replaced by current Storage table data
          </HelpBlock>

          <Radio
            type="radio"
            title="Incremental"
            disabled={disabled}
            onChange={() => onChange({incrementalLoad: 1})}
            checked={value.incrementalLoad > 0}>
            Incremental
          </Radio>
          <HelpBlock>
            Data will be appended to the dataset. Only rows created or update in last {' '}
            <input
              type="number"
              value={value.incrementalLoad}
              onChange={(e) => onChange({incrementalLoad: e.target.value})}
            />
            {' '} days will be uploaded
          </HelpBlock>
        </FormGroup>
      </form>
    );
  }
});
