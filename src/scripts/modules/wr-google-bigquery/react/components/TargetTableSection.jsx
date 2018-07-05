import React, {PropTypes} from 'react';
import {Form, FormControl, FormGroup, ControlLabel, Col} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {value, onChange, disabled} = this.props;
    return (
      <Form horizontal>
        <h3>BigQuery</h3>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Target Table Name
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              disabled={disabled}
              onChange={e => onChange({name: e.target.value})}
              value={value.name}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
});
