import React from 'react';
import { FormGroup, HelpBlock } from 'react-bootstrap';
import {Radio} from 'react-radio-group';

const RadioGroupInput = (props) => {
  return (
    <FormGroup>
      <div className={props.wrapperClassName}>
        <div className="radio">
          <label title={props.label}>
            <Radio value={props.value} />
            <span>{props.label}</span>
          </label>
        </div>
        {props.help && <HelpBlock>{props.help}</HelpBlock>}
      </div>
    </FormGroup>
  );
};

RadioGroupInput.propTypes = {
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.node.isRequired,
  help: React.PropTypes.node,
  wrapperClassName: React.PropTypes.string
};

export default RadioGroupInput;