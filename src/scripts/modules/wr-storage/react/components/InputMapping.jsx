import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
// import { Input } from './../../../../react/common/KbcBootstrap';
import {Form, FormControl, FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';
import ChangedSinceInput from '../../../../react/common/ChangedSinceInput';
import StorageApiLink from '../../../components/react/components/StorageApiTableLinkEx';
import Select from '../../../../react/common/Select';
import {PanelWithDetails} from '@keboola/indigo-ui';

const whereOperatorValues = [
  {
    label: '= (IN)',
    value: 'eq'
  },
  {
    label: '!= (NOT IN)',
    value: 'ne'
  }
];

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      source: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      columns: PropTypes.array.isRequired,
      whereColumn: PropTypes.string.isRequired,
      whereValues: PropTypes.array.isRequired,
      whereOperator: PropTypes.string.isRequired,
      changedSince: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    table: PropTypes.object.isRequired
  },

  getColumnsOptions() {
    const columns = this.props.table.get('columns');
    return columns.map(function(column) {
      return {
        label: column,
        value: column
      };
    }).toJS();
  },

  render() {
    const props = this.props;
    return (
      <span>
          <Form>
          <FormGroup>
            <h3>Source</h3>
            <ControlLabel>Source Table</ControlLabel>
            <FormControl.Static>
              <StorageApiLink
                tableId={this.props.value.source}
              >
                {this.props.value.source}
              </StorageApiLink>
            </FormControl.Static>
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
          </Form>
        <PanelWithDetails>

        <Form>
          <FormGroup>
            <ControlLabel>Columns</ControlLabel>
            <Select
              multi={true}
              name="columns"
              value={this.props.value.columns}
              disabled={this.props.disabled}
              placeholder="All columns will be imported"
              onChange={function(value) {
                props.onChange({columns: value});
              }}
              options={this.getColumnsOptions()}
            />
            <HelpBlock>Import only specified columns.</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Changed in last</ControlLabel>
            <ChangedSinceInput
              value={this.props.value.changedSince}
              onChange={function(value) {
                props.onChange({changedSince: value});
              }}
              disabled={this.props.disabled}
            />
          </FormGroup>
        </Form>
        <ControlLabel>Data filter</ControlLabel>
        <Form componentClass="fieldset" inline>
          <FormGroup className="col-md-5">
              <Select
                name="whereColumn"
                value={this.props.value.whereColumn}
                disabled={this.props.disabled}
                placeholder="Select column"
                onChange={function(value) {
                  props.onChange({whereColumn: value});
                }}
                options={this.getColumnsOptions()}
              />
          </FormGroup>
          {' '}
          <FormGroup className="col-md-2">
            <Select
              name="whereOperator"
              value={this.props.value.whereOperator}
              disabled={this.props.disabled}
              placeholder="Select operator"
              onChange={function(value) {
                props.onChange({whereOperator: value});
              }}
              options={whereOperatorValues}
              clearable={false}
            />
          </FormGroup>
          {' '}
          <FormGroup className="col-md-5">
              <Select
                multi={true}
                name="columns"
                value={this.props.value.whereValues}
                disabled={this.props.disabled}
                placeholder="Add value"
                onChange={function(value) {
                  props.onChange({whereValues: value});
                }}
                allowCreate={true}
                emptyStrings={true}
              />
          </FormGroup>
          <HelpBlock>Import only a portion of the original table.</HelpBlock>
        </Form>
        </PanelWithDetails>
      </span>
    );
  }
});
