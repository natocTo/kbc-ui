import React from 'react';
import {Input} from './../../../../react/common/KbcBootstrap';
import Immutable from 'immutable';
import Select from 'react-select';

module.exports = React.createClass({
  displayName: 'CreateDockerSandboxForm',
  propTypes: {
    tables: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    type: React.PropTypes.string.isRequired,
    showAdvancedParams: React.PropTypes.bool.isRequired
  },
  getDefaultProps() {
    return {
      showAdvancedParams: false
    };
  },
  getInitialState() {
    return {
      rows: 0,
      tables: Immutable.List(),
      packagesItems: Immutable.List(),
      tagsItems: Immutable.List()
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
              placeholder="Select tables to load..."
            />
            <p className="help-block">
              Tables must be loaded into {this.props.type} when creating. Data cannot be added later.
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
              help="0 to import all rows"
            />
          </div>
        </div>
        {this.renderAdvancedParams()}
      </form>
    );
  },
  renderAdvancedParams: function() {
    if (!this.props.showAdvancedParams) {
      return null;
    }
    return (
      <span>
        <div className="form-group">
          <label className="col-sm-3 control-label">
            Packages
          </label>
          <div className="col-sm-9">
            <Select.Creatable
              name="packages"
              value={this.state.packagesItems.toJS()}
              multi={true}
              onChange={this.onChangePackages}
              placeholder="Add packages..."
              />
            <span className="help-block">
              <span>These packages will be installed from PyPI to the Python script environment. Do not forget to load them using <code>import</code>.</span>
            </span>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-3 control-label">
            Stored Files
          </label>
          <div className="col-sm-9">
            <Select.Creatable
              name="tags"
              value={this.state.tagsItems.toJS()}
              multi={true}
              onChange={this.onChangeTags}
              placeholder="Add tags..."
              />
            <span className="help-block">
              <span>The latest file with a given tag will be saved to <code>/data/in/user/&#123;tag&#125;</code>.</span>
            </span>
          </div>
        </div>
      </span>
    );
  },
  onChangeRows: function(e) {
    const value = parseInt(e.target.value, 10);
    this.setState({
      rows: value
    }, this.onChange);
  },
  onChangeTables: function(valueArray) {
    const value = Immutable.fromJS(valueArray);
    this.setState({
      tables: value
    }, this.onChange);
  },
  onChangePackages: function(items) {
    const value = Immutable.fromJS(items);
    this.setState({
      packagesItems: value
    }, this.onChange);
  },
  onChangeTags: function(items) {
    const value = Immutable.fromJS(items);
    this.setState({
      tagsItems: value
    }, this.onChange);
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
  onChange: function() {
    const state = this.state;
    const tablesList = this.state.tables.map(function(table) {
      var retVal = {
        source: table.get('value'),
        destination: table.get('value') + '.csv'
      };
      if (state.rows > 0) {
        retVal.limit = state.rows;
      }
      return retVal;
    }).toList();
    const packages = this.state.packagesItems.map(function(item) {
      return item.get('value');
    }).toJS();
    const tagsFiles = this.state.tagsItems.map(function(item) {
      return Immutable.Map().set('tags', Immutable.fromJS([item.get('value')]));
    }).toJS();
    const tags = this.state.tagsItems.map(function(item) {
      return item.get('value');
    }).toJS();
    this.props.onChange({
      input: {
        tables: tablesList.toJS(),
        files: tagsFiles
      },
      packages: packages,
      tags: tags
    });
  }
});

