import React from 'react';

import Immutable from 'immutable';
import TableLoader from './TableLoaderQuickStart';
import {PanelWithDetails} from '@keboola/indigo-ui';

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
    this.props.onSubmit(this.props.configId, this.props.quickstart.get('tables'));
  },

  handleSelectChange(selected) {
    return this.props.onChange(this.props.configId, Immutable.fromJS(selected.map(function(table) {
      return table.value;
    })));
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
        return memo.push(Immutable.fromJS({
          schema: group,
          tables: tableList.reduce((outmemo, table) => {
            return outmemo.set(table.get('name'), table);
          }, Immutable.Map())
        }));
      }, Immutable.List());
    }
  },

  renderSchemaSection(schema, tables) {
    const renderdedTables = tables.map((table) => {
      const tableSelected = this.props.selectedTables.hasIn([table.get('schema'), table.get('name')]);
      return (
        <div className="col-md-6">
          <input
            type="checkbox"
            value={table}
            checked={tableSelected}
          /> <label>{table.get('name')}</label>
        </div>
      );
    });
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
          <PanelWithDetails defaultExpanded={!!this.props.selectedTables.hasIn(schema)}>
            {renderdedTables}
          </PanelWithDetails>
        </div>
      </div>
    );
  },

  render() {
    const schemaGroups = this.getSchemaGroups();
    const renderedSchemas = schemaGroups.map((schemaGroup) => {
      return this.renderSchemaSection(schemaGroup.get('schema'), schemaGroup.get('tables'));
    });
    const tableSelector = (
      <div>
        <div className="row text-left">
          <div className="col-md-12 help-block">
          Select the tables you'd like to import to autogenerate your configuration. <br/>
          You can edit them later at any time.
          </div>
        </div>
        {renderedSchemas}
      </div>
    );

    return (
      <div className="row text-center">
        <TableLoader
          componentId={this.props.componentId}
          configId={this.props.configId}
          isLoadingSourceTables={this.props.isLoadingSourceTables}
          isTestingConnection={this.props.isTestingConnection}
          validConnection={this.props.validConnection}
          tableSelectorElement={tableSelector}
          refreshMethod={this.props.refreshMethod}
        />
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
  }

});
