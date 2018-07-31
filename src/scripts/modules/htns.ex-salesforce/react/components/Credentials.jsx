import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
import {Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Checkbox} from 'react-bootstrap';


export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      login: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      securityToken: PropTypes.string.isRequired,
      sandbox: PropTypes.bool.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const props = this.props;
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Login Name
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              value={this.props.value.login}
              onChange={function(e) {
                props.onChange({login: e.target.value.trim()});
              }}
              placeholder="john.doe@example.com"
              disabled={this.props.disabled}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Password
          </Col>
          <Col sm={8}>
            <FormControl
              type="password"
              value={this.props.value.password}
              onChange={function(e) {
                props.onChange({password: e.target.value.trim()});
              }}
              disabled={this.props.disabled}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Security Token
          </Col>
          <Col sm={8}>
            <FormControl
              type="password"
              value={this.props.value.securityToken}
              onChange={function(e) {
                props.onChange({securityToken: e.target.value.trim()});
              }}
              disabled={this.props.disabled}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={4} sm={8}>
            <Checkbox
              checked={this.props.value.sandbox}
              onChange={function(e) {
                props.onChange({sandbox: e.target.checked});
              }}
            >Sandbox</Checkbox>
            <HelpBlock>
              Download records from sandbox instead of the production environment.
            </HelpBlock>
          </Col>
        </FormGroup>
      </Form>
    );
  }
});
