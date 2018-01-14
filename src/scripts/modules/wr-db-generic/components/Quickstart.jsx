import React from 'react';

import {fromJS} from 'immutable';
import Select from 'react-select';
import TableLoader from './TableLoaderQuickStart';

export default React.createClass({
  displayName: 'Quickstart',
  propTypes: {
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string,
    isLoadingSourceTables: React.PropTypes.bool.isRequired,
    sourceTables: React.PropTypes.object,
    quickstartValues: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },

  quickstart() {
    const tableIds = this.props.quickstartValues.map((value) => value.get('tableId'));
    const selectedTables = this.props.sourceTables.filter((table) => tableIds.contains(table.get('id')));
    this.props.onSubmit(this.props.configId, selectedTables);
  },

  handleSelectChange(selected) {
    return this.props.onChange(this.props.configId, fromJS(selected.map(function(table) {
      return table.value;
    })));
  },

  getTableOptions() {
    if (this.props.sourceTables && this.props.sourceTables.count() > 0) {
      const groupedTables = this.props.sourceTables.groupBy(table => table.getIn(['bucket', 'id']));
      return groupedTables.keySeq().map(function(group) {
        return {
          value: group,
          label: group,
          children: groupedTables.get(group).map(function(table) {
            return {
              value: {
                tableId: table.get('id'),
                tableName: table.get('name')
              },
              label: table.get('name')
            };
          }).toJS()
        };
      });
    } else {
      return [];
    }
  },

  getQuickstartValue(tables) {
    if (tables) {
      let jsTables = tables;
      if (tables.toJS) {
        jsTables = tables.toJS();
      }
      return jsTables.map(function(table) {
        return {
          label: table.tableId,
          value: table
        };
      });
    } else {
      return [];
    }
  },

  render() {
    var tableSelector = (
      <div>
        <div className="row text-left">
          <div className="col-md-8 col-md-offset-2 help-block">
          Select the tables you'd like to export to autogenerate your configuration. <br/>
          You can edit them later at any time.
          </div>
        </div>
        <div className="row text-left">
          <div className="col-md-8 col-md-offset-2">
            <Select
              multi={true}
              matchProp="label"
              name="quickstart"
              value={this.getQuickstartValue(this.props.quickstartValues)}
              placeholder="Select tables to copy"
              onChange={this.handleSelectChange}
              filterOptions={this.filterOptions}
              optionRenderer={this.optionRenderer}
              options={this.transformOptions(this.getTableOptions())}/>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-success"
              onClick={this.quickstart}
              disabled={!this.props.quickstartValues || this.props.quickstartValues.count() === 0}
            > Create
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="row text-center">
        <TableLoader
          componentId={this.props.componentId}
          configId={this.props.configId}
          isLoadingSourceTables={this.props.isLoadingSourceTables}
          tableSelectorElement={tableSelector}
        />
      </div>
    );
  },

  filterOptions(options, filterString, values) {
    var filterOption = function(op) {
      if (values && fromJS(values).toMap().find(
        function(item) {
          return item.get('label') === op.label;
        }, op)
      ) {
        return false;
      }
      var labelTest = String(op.label).toLowerCase();
      var filterStr = filterString.toLowerCase();
      return !filterStr || labelTest.indexOf(filterStr) >= 0;
    };
    return (options || []).filter(filterOption, this);
  },

  transformOptions(options) {
    let newOptions = [];

    options.forEach((bucket) => {
      newOptions.push({
        value: bucket.value,
        label: bucket.label,
        render: (<strong style={{color: '#000'}}>Bucket: {bucket.label}</strong>),
        disabled: true
      });

      fromJS(bucket.children).forEach((item) => {
        newOptions.push({
          value: item.getIn(['value']),
          label: item.get('label'),
          render: (<div>{item.get('label')}</div>),
          disabled: false
        });
      });
    });

    return newOptions;
  },

  optionRenderer(option) {
    return option.render;
  }

});
