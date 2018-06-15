import React from 'react';

import {fromJS, Map, List} from 'immutable';
import Select from 'react-select';
import TableLoader from './TableLoaderQuickStart';
import {PanelWithDetails} from '@keboola/indigo-ui';

const RENDERTYPE = 'checkbox';

export default React.createClass({
  displayName: 'Quickstart',
  propTypes: {
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string,
    isLoadingSourceTables: React.PropTypes.bool.isRequired,
    isTestingConnection: React.PropTypes.bool.isRequired,
    validConnection: React.PropTypes.bool.isRequired,
    sourceTables: React.PropTypes.object,
    sourceTablesError: React.PropTypes.string,
    quickstart: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    refreshMethod: React.PropTypes.func.isRequired,
    selectedTables: React.PropTypes.object
  },

  quickstart() {
    this.props.onSubmit(this.props.configId, this.props.selectedTables);
  },

  handleSelectChange(selected) {
    return this.props.onChange(this.props.configId, fromJS(selected.map(function(table) {
      return table.value;
    })));
  },

  handleCheckedTableChange(e) {
    if (e.target.checked) {
      return this.props.onChange(
        this.props.configId,
        this.props.selectedTables.setIn(
          [fromJS(JSON.parse(e.target.value)).get('schema'), fromJS(JSON.parse(e.target.value)).get('name')],
          fromJS(JSON.parse(e.target.value))
        )
      );
    } else {
      return this.props.onChange(
        this.props.configId,
        this.props.selectedTables.deleteIn(
          [fromJS(JSON.parse(e.target.value)).get('schema'), fromJS(JSON.parse(e.target.value)).get('name')]
        )
      );
    }
  },

  handleSelectedTableChange(schema, newValue) {
    return this.props.onChange(
      this.props.configId,
      this.props.selectedTables.setIn([schema], newValue)
    );
  },

  handleSelectAllSchemaChnage(e) {
    const schemaGroups = this.getSchemaGroups();
    if (e.target.checked) {
      // add all tables from this schema
      const selectedSchema = schemaGroups.find((schemaGroup) => {
        return schemaGroup.get('schema') === e.target.value;
      });
      return this.props.onChange(
        this.props.configId,
        this.props.selectedTables.setIn([e.target.value], selectedSchema.get('tables'))
      );
    } else {
      // uncheck all schema tables
      return this.props.onChange(
        this.props.configId,
        this.props.selectedTables.deleteIn([e.target.value])
      );
    }
  },

  getSchemaGroups() {
    if (this.props.sourceTables && this.props.sourceTables.count() > 0) {
      const groupedTables = this.props.sourceTables.groupBy(table => table.get('schema'));
      return groupedTables.reduce((memo, tableList, group) => {
        return memo.push(fromJS({
          schema: group,
          tables: tableList.reduce((outmemo, table) => {
            return outmemo.set(table.get('name'), table);
          }, Map())
        }));
      }, List());
    }
  },

  getTablesSelectedValue() {
    return this.props.selectedTables.map((table) => {
      return JSON.stringify(table.toJS());
    });
  },

  getTablesSelectOptions(tables) {
    return tables.map((table) => {
      return {
        label: table.get('name'),
        value: JSON.stringify(table.toJS())
      };
    });
  },

  renderTableSelectBox(schema, tables) {
    return (
      <Select
        multi={true}
        matchProp="label"
        name={schema}
        value={this.getTablesSelectedValue}
        placeholder="Select tables to copy"
        onChange={this.handleSelectChange}
        options={this.getTablesSelectOptions(tables)}
      />
    );
  },

  renderTableCheckboxes(schema, tables) {
    const renderedTables = tables.map((table) => {
      const tableSelected = this.props.selectedTables.hasIn([table.get('schema'), table.get('name')]);
      return (
        <div className="col-md-6">
          <input
            type="checkbox"
            value={JSON.stringify(table.toJS())}
            checked={tableSelected}
            onChange={this.handleSelectedTableChange}
          /> <label>{table.get('name')}</label>
        </div>
      );
    });
    return (
      <PanelWithDetails defaultExpanded={!!this.props.selectedTables.hasIn(schema)}>
        {renderedTables}
      </PanelWithDetails>
    );
  },

  renderSchemaSection(schema, tables) {
    return (
      <div className="row text-left">
        <div className="col-md-12">
          <label>
            <strong>{schema} </strong>
          </label>
          <input
            name={schema}
            value={schema}
            type="checkbox"
            onChange={this.handleSelectAllSchemaChnage}
            checked={!!this.props.selectedTables.hasIn([schema])}
          /> select all / deselect all
          {
            RENDERTYPE === 'checkbox'
              ? this.renderTableCheckboxes(schema, tables)
              : this.renderTableSelectBox(schema, tables)
          }
        </div>
      </div>
    );
  },

  getTableSelector() {
    if (this.props.sourceTables) {
      const schemaGroups = this.getSchemaGroups();
      const renderedSchemas = schemaGroups.map((schemaGroup) => {
        return this.renderSchemaSection(schemaGroup.get('schema'), schemaGroup.get('tables'));
      });
      return (
        <div>
          <div>
            <div className="row text-left">
              <div className="col-md-12 help-block">
                Select the tables you'd like to import to autogenerate your configuration. <br/>
                You can edit them later at any time.
              </div>
            </div>
            {renderedSchemas}
          </div>
          <div className="row text-center">
            <div className="col-md-12">
              <button
                className="btn btn-success"
                onClick={this.quickstart}
                disabled={!this.props.quickstart.get('tables') || this.props.quickstart.get('tables').count() === 0}
              > Create
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  },

  render() {
    return (
      <div className="row text-center">
        <TableLoader
          componentId={this.props.componentId}
          configId={this.props.configId}
          isLoadingSourceTables={this.props.isLoadingSourceTables}
          isTestingConnection={this.props.isTestingConnection}
          validConnection={this.props.validConnection}
          tableSelectorElement={this.getTableSelector()}
          refreshMethod={this.props.refreshMethod}
        />
      </div>
    );
  }

});
