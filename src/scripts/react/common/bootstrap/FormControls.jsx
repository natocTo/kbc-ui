import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const FormControls = {};

FormControls.Static = React.createClass({

  propTypes: {
    label: React.PropTypes.node,
    children: React.PropTypes.node,
    bsSize: React.PropTypes.oneOf(['sm', 'small', 'lg', 'large']),
    wrapperClassName: React.PropTypes.string,
    labelClassName: React.PropTypes.string
  },

  render() {
    return (
      <FormGroup bsSize={this.props.bsSize}>
        <ControlLabel className={this.props.labelClassName}>
          {this.props.label}
        </ControlLabel>
        <FormControl.Static className={this.props.wrapperClassName}>
          {this.props.children}
        </FormControl.Static>
      </FormGroup>
    );
  }

});

export default FormControls;
