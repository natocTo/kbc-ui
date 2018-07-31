import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
import {Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Checkbox} from 'react-bootstrap';


export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      object: PropTypes.string.isRequired,
      query: PropTypes.string.isRequired,
      incremental: PropTypes.bool.isRequired
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
            Object
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              value={this.props.value.object}
              onChange={function(e) {
                props.onChange({object: e.target.value.trim()});
              }}
              placeholder="User"
              disabled={this.props.disabled}
              />
            <HelpBlock>
              Salesforce object identifier, eg. Account.
            </HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={4} sm={8}>
            <Checkbox
              checked={this.props.value.incremental}
              onChange={function(e) {
                props.onChange({incremental: e.target.checked});
              }}
            >Incremental</Checkbox>
            <HelpBlock>
              Download only new records since the last extraction. The <code>Id</code> column must be included if you use custom query as it will be the primary key.
            </HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>
            Custom SOQL Query
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              value={this.props.value.query}
              onChange={function(e) {
                props.onChange({query: e.target.value});
              }}
              placeholder="SELECT Id, Name FROM User"
              disabled={this.props.disabled}
              />
              <HelpBlock>
                Specify the SOQL query for the given object. If the SOQL is not specified, extractor will download all available columns.
              </HelpBlock>
          </Col>
        </FormGroup>
      </Form>
    );
  }
});
