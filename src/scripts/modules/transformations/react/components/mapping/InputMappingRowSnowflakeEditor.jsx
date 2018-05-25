import React from 'react';
import _ from 'underscore';

import Immutable from 'immutable';
import {Input} from './../../../../../react/common/KbcBootstrap';

import Select from '../../../../../react/common/Select';
import SapiTableSelector from '../../../../components/react/components/SapiTableSelector';
import SnowflakeDataTypesContainer from "./input/SnowflakeDataTypesContainer";
import ChangedSinceInput from '../../../../../react/common/ChangedSinceInput';
import {PanelWithDetails} from '@keboola/indigo-ui';

module.exports = React.createClass({
  propTypes: {
    value: React.PropTypes.object.isRequired,
    tables: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    initialShowDetails: React.PropTypes.bool.isRequired,
    isDestinationDuplicate: React.PropTypes.bool.isRequired
  },

  _handleChangeSource(value) {
    // use only table name from the table identifier
    var destination;
    if (value) {
      destination = value.substr(value.lastIndexOf(".") + 1);
    } else {
      destination = '';
    }
    const mutatedValue = this.props.withMutations((mapping) => {
      mapping = mapping.set("source", value);
      mapping = mapping.set("destination", destination);
      mapping = mapping.set("datatypes", Immutable.Map());
      mapping = mapping.set("whereColumn", "");
      mapping = mapping.set("whereValues", Immutable.List());
      mapping = mapping.set("whereOperator", "eq");
      mapping = mapping.set("columns", Immutable.List());
    });
    return this.props.onChange(mutatedValue);
  },

  _handleChangeDestination(e) {
    return this.props.onChange(this.props.value.set('destination', e.target.value.trim()));
  },

  _handleChangeChangedSince(changedSince) {
    let value = this.props.value;
    if (this.props.value.has('days')) {
      value = value.delete('days');
    }
    value = value.set('changedSince', changedSince);
    return this.props.onChange(value);
  },

  _handleChangeColumns(newValue) {
    const mutatedValue = this.props.value.withMutations((mapping) => {
      mapping = mapping.set('columns', newValue);
      if (newValue.count()) {
        let columns = mapping.get('columns').toJS();
        if (!_.contains(columns, mapping.get("whereColumn"))) {
          mapping = mapping.set('whereColumn', '');
          mapping = mapping.set('whereValues', Immutable.List());
          mapping = mapping.set('whereOperator', 'eq');
        }
        let datatypes = _.pick(mapping.get('datatypes').toJS(), columns);
        mapping = mapping.set('datatypes', Immutable.fromJS(datatypes || Immutable.Map()));
      }
    });
    return this.props.onChange(mutatedValue);
  },

  _handleChangeWhereColumn(string) {
    return this.props.onChange(this.props.value.set("whereColumn", string));
  },

  _handleChangeWhereOperator(e) {
    return this.props.onChange(this.props.value.set("whereOperator", e.target.value));
  },
  _handleChangeWhereValues(newValue) {
    return this.props.onChange(this.props.value.set("whereValues", newValue));
  },

  _handleChangeDataTypes(datatypes) {
    return this.props.onChange(this.props.value.set("datatypes", datatypes));
  },

  _getColumns() {
    if (!this.props.value.get('source')) {
      return [];
    }
    const table = this.props.tables.find((table) => {
      return table.get('id') === this.props.value.get('source');
    });
    if (table) {
      return table.get('columns').toJS()
    }
    return [];
  },

  _getColumnsOptions() {
    const columns = this._getColumns();
    return _.map(columns, (columns) => {
      return {
        label: column,
        value: column
      };
    })
  },

  _getFilteredColumnsOptions() {
    var columns;
    if (this.props.value.get('columns', Immutable.List()).count() > 0) {
      columns = this.props.value.get('columns').toJS();
    } else {
      columns = this._getColumns();
    }
    return _.map(columns, (column) => {
      return {
        label: column,
        value: column
      };
    });
  },

  getChangedSinceValue() {
    return this.props.value.get('changedSince')
      ? this.props.value.get('changedSince')
      : this.props.value.get('days') > 0 ? "-" + this.props.value.get('days') + ' days' : null;
  },

  render() {
    return (
      <div className="form-horizontal clearfix">
        <div className="row col-md-12">
          <div className="form-group">
            <label className="col-xs-2 control-label">Source</label>
            <div className="col-xs-10">
              <SapiTableSelector
                value={this.props.value.get("source")}
                disabled={this.props.disabled}
                placeholder="Source Table"
                onSelectTableFn={this._handleChangeSource}
                autoFocus={true}
              />
            </div>
          </div>
        </div>
        <div className="row col-md-12">
          <Input
            type="text"
            label="Destination"
            value={this.props.value.get("destination")}
            disabled={this.props.disabled}
            placeholder="Destination table name in transformation DB"
            onChange={this._handleChangeDestination}
            labelClassName="col-xs-2"
            wrapperClassName="col-xs-10"
            bsStyle={this.props.isDestinationDuplicate() ? 'error' : null}
            help={
              this.props.isDestinationDuplicate()
                ? (
                  <span className="error">
                      Duplicate Destination <code>{this.props.value.get('destination')}</code>.
                    </span>
                )
                : null
            }
          />
        </div>
        <div className="row col-md-12">
          <PanelWithDetails defaultExpanded={this.props.initialShowDetails}>
            <div className="form-horizontal clearfix">
              <div className="form-group">
                <label className="col-xs-2 control-label">Columns</label>
                <div className="col-xs-10">
                  <Select
                    multi={true}
                    name="columns"
                    value={this.props.get("columns", Immutable.List()).toJS()}
                    disabled={this.props.disabled || !this.props.value.get("source")}
                    placeholder="All columns will be imported"
                    onChange={this._handleChangeColumns}
                    options={this._getColumnsOptions()}
                  />
                  <div className="help-block">
                    Import only specified columns
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-xs-2 control-label">Changed in last</label>
                <div className="col-xs-10">
                  <ChangedSinceInput
                    value={this.getChangedSinceValue()}
                    disabled={this.props.disabled}
                    onChange={this._handleChangeChangedSince}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-xs-2 control-label">Data filter</label>
                <div className="col-xs-4">
                  <Select
                    name="whereColumn"
                    value={this.props.value.get("whereColumn")}
                    disabled={this.props.disabled || !this.props.value.get("source")}
                    onChange={this._handleChangeWhereColumn}
                    options={this._getColumnsOptions()}
                  />
                </div>
                <div className="col-xs-2">
                  <Input
                    type="select"
                    name="whereOperator"
                    value={this.props.value.get('whereOperator')}
                    disabled={this.props.disabled}
                    onChange={this._handleChangeWhereOperator}
                  >
                    <option value="eq">= (IN)</option>
                    <option value="ne">!= (NOT IN)</option>
                  </Input>
                </div>
                <div className="col-xs-4">
                  <Select
                    value="whereValues"
                    multi={true}
                    disabled={this.props.disabled}
                    allowCreate={true}
                    placeholder="Add a value..."
                    emptyStrings={true}
                    onChange={this._handleChangeWhereValues}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-xs-2 control-label">Data types</label>
                <div className="col-xs-10">
                  <SnowflakeDataTypesContainer
                    value={this.props.value.get('datatypes', Immutable.Map())}
                    disabled={this.props.disabled || !this.props.value.get("source")}
                    onChange={this._handleChangeDataTypes}
                    columnsOptions={this._getColumnsOptions()}
                  />
                </div>
              </div>
            </div>
          </PanelWithDetails>
        </div>
      </div>
    );
  }
};
