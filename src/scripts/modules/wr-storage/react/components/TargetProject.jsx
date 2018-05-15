import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
// import { Input } from './../../../../react/common/KbcBootstrap';
import {FormControl, FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      url: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const props = this.props;
    return (
      <form>
        <FormGroup>
          <ControlLabel>Project Region</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="select"
            value={this.props.value.url}
            onChange={function(e) {
              props.onChange({url: e.target.value});
            }}
            disabled={this.props.disabled}
          >
            <option value="" disabled>Select region</option>
            <option value="https://connection.keboola.com/">US</option>
            <option value="https://connection.eu-central-1.keboola.com/">EU</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Storage API Token</ControlLabel>
          <FormControl
            type="password"
            value={this.props.value.token}
            onChange={function(e) {
              props.onChange({token: e.target.value});
            }}
            disabled={this.props.disabled}
            />
            <HelpBlock>Use token with permissions limited only to write to a single target bucket.</HelpBlock>
        </FormGroup>
      </form>
    );
  }
});
