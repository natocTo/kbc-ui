import React from 'react';
import {Input} from './../../../../react/common/KbcBootstrap';
import Immutable from 'immutable';
import Select from 'react-select';

module.exports = React.createClass({
  displayName: 'CreateDockerSandboxForm',
  propTypes: {
    tables: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    type: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return {
      rows: 0,
      tables: Immutable.List()
    };
  },
  render: function() {
    return (
      <form className="form-horizontal">
        <div className="form-group">
          <label className="col-sm-3 control-label">
            Tables
          </label>
          <div className="col-sm-9">
            <Select
              value={this.state.tables.toJS()}
              multi={true}
              options={this.getTablesOptions().toJS()}
              onChange={this.onChangeTables}
              placeholder="Select tables to load"
            />
            <p className="help-block">
              The required tables must be loaded into {this.props.type} when creating the sandbox. Data cannot be added later.
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-3 control-label">
            Sample rows
          </label>
          <div className="col-sm-9">
            <Input
              type="number"
              placeholder="Number of rows"
              value={this.state.rows}
              onChange={this.onChangeRows}
              help="To import all rows, use 0."
            />
          </div>
        </div>
      </form>
    );
  },
  onChangeRows: function(e) {
    const value = parseInt(e.target.value, 10);
    this.setState({
      rows: value
    });
    this.onChange(this.state.tables, value);
  },
  onChangeTables: function(valueArray) {
    const value = Immutable.fromJS(valueArray);
    this.setState({
      tables: value
    });
    this.onChange(value, this.state.rows);
  },
  getTablesOptions: function() {
    return this.props.tables.map(
      function(table) {
        return {
          label: table,
          value: table
        };
      }
    ).sortBy(function(table) {
      return table.value.toLowerCase();
    });
  },
  onChange: function(tables, rows) {
    const tablesList = tables.map(function(table) {
      var retVal = {
        source: table.get('value'),
        destination: table.get('value') + '.csv'
      };
      if (rows > 0) {
        retVal.limit = rows;
      }
      return retVal;
    }).toList();
    this.props.onChange({
      input: {
        tables: tablesList.toJS()
      }
    });
  }
});

