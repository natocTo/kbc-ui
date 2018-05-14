import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
// import { Input } from './../../../../react/common/KbcBootstrap';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      source: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const props = this.props;
    return (
      <form>
        <FormGroup>
        <h3>Source</h3>
        <ControlLabel>Source Table</ControlLabel>
        <FormControl
          type="text"
          value={this.props.value.source}
          onChange={function(e) {
            props.onChange({source: e.target.value});
          }}
          placeholder="in.c-main.mytable"
          disabled={true}
          />
        <h3>Destination</h3>
        <ControlLabel>Destination Table Name</ControlLabel>
        <FormControl
          type="text"
          value={this.props.value.destination}
          onChange={function(e) {
            props.onChange({destination: e.target.value});
          }}
          placeholder="mytable"
          disabled={this.props.disabled}
          />
        </FormGroup>
      </form>
    );
  }
});
