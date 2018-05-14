import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
// import { Input } from './../../../../react/common/KbcBootstrap';
import {FormControl, FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      url: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      bucket: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const props = this.props;
    return (
      <form>
        <FormGroup>
          <ControlLabel>Storage API URL</ControlLabel>
          <FormControl
            type="text"
            value={this.props.value.url}
            onChange={function(e) {
              props.onChange({url: e.target.value});
            }}
            disabled={this.props.disabled}
            />
          <HelpBlock>
            URL of the target Storage (e.g. https://connection.keboola.com/).
          </HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Bucket ID</ControlLabel>
          <FormControl
            type="text"
            value={this.props.value.bucket}
            onChange={function(e) {
              props.onChange({bucket: e.target.value});
            }}
            disabled={this.props.disabled}
            />
          <HelpBlock>Full bucket ID (e.g. in.c-main).</HelpBlock>
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
            <HelpBlock>Use token with permissions limited only to write to the target bucket.</HelpBlock>
        </FormGroup>
      </form>
    );
  }
});
