import React from 'react';
import Select from 'react-select';
import ExportHelp from './ExportHelp';
import LinkToDocs from './LinkToDocs';
import CodeMirror from 'react-code-mirror';

export default React.createClass({
  propTypes: {
    query: React.PropTypes.object.isRequired,
    exports: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    outTableExist: React.PropTypes.bool,
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    component: React.PropTypes.object.isRequired
  },
  handleNameChange(event) {
    return this.props.onChange(this.props.query.set('name', event.target.value));
  },
  handleIncrementalChange(event) {
    return this.props.onChange(this.props.query.set('incremental', event.target.checked));
  },
  handleQueryChange(event) {
    return this.props.onChange(this.props.query.set('query', event.target.value));
  },
  handleSortChange(event) {
    return this.props.onChange(this.props.query.set('sort', event.target.value));
  },
  handleLimitChange(event) {
    return this.props.onChange(this.props.query.set('limit', event.target.value));
  },
  handleMappingChange(event) {
    return this.props.onChange(this.props.query.set('mapping', event.target.value));
  },
  handleCollectionChange(event) {
    return this.props.onChange(this.props.query.set('collection', event.target.value));
  },
  handleModeChange(selected) {
    return this.props.onChange(this.props.query.set('mode', selected.value));
  },
  render() {
    return (
      <div>
        <LinkToDocs documentationUrl={this.props.component.get('documentationUrl')} />
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-md-2 control-label">
              Name
              <ExportHelp message="Name has to be unique across all exports in current configuration" />
            </label>
            <div className="col-md-4">
              <input
                autoFocus={true}
                className="form-control"
                onChange={this.handleNameChange}
                placeholder="e.g. last-100-articles"
                type="text"
                value={this.props.query.get('name')}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">Collection</label>
            <div className="col-md-4">
              <input
                className="form-control"
                onChange={this.handleCollectionChange}
                placeholder="e.g. Article"
                type="text"
                value={this.props.query.get('collection')}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">
              Query
              <ExportHelp message="Query to filter documents. Has to be valid JSON." />
            </label>
            <div className="col-md-10">
              <CodeMirror
                lineNumbers
                lineWrapping
                lint
                mode="application/json"
                onChange={this.handleQueryChange}
                placeholder={'optional, e.g. {"isActive": 1, "isDeleted": 0}'}
                theme="solarized"
                value={this.props.query.has('query') ? this.props.query.get('query') : undefined}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">
              Sort
              <ExportHelp message="Sort results by specified keys. Has to be valid JSON." />
            </label>
            <div className="col-md-10">
              <CodeMirror
                lineNumbers
                lineWrapping
                lint
                mode="application/json"
                onChange={this.handleSortChange}
                placeholder={'optional, e.g. {"creationDate": -1}'}
                theme="solarized"
                value={this.props.query.has('sort') ? this.props.query.get('sort').toString() : undefined}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">Limit</label>
            <div className="col-md-4">
              <input
                className="form-control"
                onChange={this.handleLimitChange}
                placeholder="optional, e.g. 100"
                value={this.props.query.get('limit')}
                type="text"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">Incremental</label>
            <div className="col-md-4">
              <div style={{ marginTop: '1em', paddingLeft: '1em' }} />
              <label>
                <input
                  onChange={this.handleIncrementalChange}
                  type="checkbox"
                  checked={this.props.query.get('incremental')}
                />
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">
              Mode
              <ExportHelp
                message={
                  'Mapping mode allows you to define more precise structure.\n' +
                  'In raw mode, only JSON objects are exported.'
                }
              />
            </label>
            <div className="col-md-4">
              <Select
                name="mode"
                clearable={false}
                options={[{ label: 'Mapping', value: 'mapping' }, { label: 'Raw', value: 'raw' }]}
                onChange={this.handleModeChange}
                value={this.props.query.get('mode') ? this.props.query.get('mode') : 'mapping'}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">
              Mapping
              <ExportHelp message="Mapping to define structure of exported tables. Has to be valid JSON." />
            </label>
            <div className="col-md-10">
              <CodeMirror
                lineNumbers
                lineWrapping
                lint
                mode="application/json"
                onChange={this.handleMappingChange}
                placeholder={'e.g. {"_id.$oid": "id", "name": "name"}'}
                theme="solarized"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
