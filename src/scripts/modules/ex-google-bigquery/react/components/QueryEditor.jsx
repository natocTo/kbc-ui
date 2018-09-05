import React from 'react';
import CodeEditor from '../../../../react/common/CodeEditor';
import Select from '../../../../react/common/Select';
import AutosuggestWrapper from '../../../transformations/react/components/mapping/AutoSuggestWrapper';
import editorMode from '../../../ex-db-generic/templates/editorMode';

const QueryEditor = props => {
  const _handleOutputTableChange = newValue => {
    return props.onChange(props.query.set('outputTable', newValue));
  };

  const _handlePrimaryKeyChange = newValue => {
    return props.onChange(props.query.set('primaryKey', newValue));
  };

  const _handleIncrementalChange = event => {
    return props.onChange(props.query.set('incremental', event.target.checked));
  };

  const _handleLegacySqlChange = event => {
    return props.onChange(props.query.set('useLegacySql', event.target.checked));
  };

  const _handleQueryChange = data => {
    return props.onChange(props.query.set('query', data.value));
  };

  const _handleNameChange = event => {
    return props.onChange(props.query.set('name', event.target.value));
  };

  const _tableNamePlaceholder = () => {
    return `default: ${props.defaultOutputTable}`;
  };

  const _tableSelectOptions = () => {
    return props.tables.map(table => table.get('id')).sortBy(val => val);
  };

  return (
    <div className="row">
      <div className="form-horizontal">
        <div className="form-group">
          <label className="col-md-2 control-label">Name</label>
          <div className="col-md-4">
            <input
              className="form-control"
              type="text"
              value={props.query.get('name')}
              ref="queryName"
              placeholder="e.g. Untitled Query"
              onChange={_handleNameChange}
              autoFocus={true}
            />
          </div>
          <label className="col-md-2 control-label">Primary key</label>
          <div className="col-md-4">
            <Select
              name="primaryKey"
              value={props.query.get('primaryKey')}
              multi={true}
              disabled={false}
              allowCreate={true}
              delimiter=","
              placeholder="No primary key"
              emptyStrings={false}
              onChange={_handlePrimaryKeyChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-2 control-label">Output table</label>
          <div className="col-md-6">
            <AutosuggestWrapper
              suggestions={_tableSelectOptions()}
              placeholder={_tableNamePlaceholder()}
              value={props.query.get('outputTable')}
              onChange={_handleOutputTableChange}
            />
            <div className="help-block">If empty, the default will be used.</div>
          </div>
          <div className="col-md-4 checkbox">
            <label>
              <input type="checkbox" checked={props.query.get('incremental')} onChange={_handleIncrementalChange} />
              Incremental
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-2 control-label">{''}</label>
          <div className="col-md-10 checkbox">
            <label>
              <input type="checkbox" checked={props.query.get('useLegacySql')} onChange={_handleLegacySqlChange} />
              Use Legacy SQL
            </label>
            <div className="help-block">
              By default, BigQuery runs queries using legacy SQL. <br /> Uncheck this to run queries using BigQuery's
              updated SQL dialect with improved standards compliance.
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-12 control-label">SQL query</label>
          {props.componentId === 'keboola.ex-db-oracle' ? (
            <div className="col-md-12">
              <div className="help-block">Do not leave a semicolon at the end of the query.</div>
            </div>
          ) : null}
          <div className="col-md-12">
            <CodeEditor
              readOnly={false}
              placeholder="e.g. SELECT `id`, `name` FROM `myTable`"
              value={props.query.get('query')}
              mode={editorMode(props.componentId)}
              onChange={_handleQueryChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

QueryEditor.propTypes = {
  query: React.PropTypes.object.isRequired,
  tables: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
  defaultOutputTable: React.PropTypes.string.isRequired,
  componentId: React.PropTypes.string.isRequired
};

export default QueryEditor;
