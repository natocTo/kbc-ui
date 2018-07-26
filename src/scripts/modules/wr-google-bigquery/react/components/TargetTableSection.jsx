import React, {PropTypes} from 'react';
import {Form, FormControl, FormGroup, ControlLabel, Col} from 'react-bootstrap';
import StorageApiLink from '../../../components/react/components/StorageApiTableLinkEx';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      source: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {value, onChange, disabled} = this.props;
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Source Table
          </Col>
          <Col sm={8}>
            <FormControl.Static>
              <StorageApiLink
                tableId={this.props.value.source}
              >
                {this.props.value.source}
              </StorageApiLink>
            </FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Target Table Name
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              disabled={disabled}
              onChange={e => onChange({destination: e.target.value})}
              value={value.destination}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
});
