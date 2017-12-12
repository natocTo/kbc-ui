import React, {PropTypes} from 'react';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';
import {Input} from './../../../../react/common/KbcBootstrap';
import CsvDelimiterInput from '../../../../react/common/CsvDelimiterInput';
import Select from '../../../../react/common/Select';
import Immutable from 'immutable';

const columnsFromOptions = [
  {
    label: 'Set headers manually',
    value: 'manual'
  },
  {
    label: 'Read headers from the file(s) header',
    value: 'header'
  },
  {
    label: 'Create headers automatically',
    value: 'auto'
  }
];

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const props = this.props;
    return (
      <div className="form-horizontal">
        <h3>S3 Settings</h3>
        <Input
          type="text"
          label="S3 Bucket"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.value.get('bucket')}
          onChange={function(e) {
            props.onChange(props.value.set('bucket', e.target.value));
          }}
          placeholder="mybucket"
          disabled={this.props.disabled}
          />
        <Input
          type="text"
          label="Search Key"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.value.get('key')}
          onChange={function(e) {
            props.onChange(props.value.set('key', e.target.value));
          }}
          placeholder="myfolder/myfile.csv"
          disabled={this.props.disabled}
          help={(<span>Filename including folders or a prefix.</span>)}
          />
        <h3>Download Settings</h3>
        <Input
          type="checkbox"
          label="Wildcard"
          wrapperClassName="col-xs-8 col-xs-offset-4"
          checked={this.props.value.get('wildcard')}
          onChange={function(e) {
            props.onChange(props.value.set('wildcard', e.target.checked));
          }}
          disabled={this.props.disabled}
          help={(<span>Match all files beginning with the specified key.</span>)}
          />
        <Input
          type="checkbox"
          label="Subfolders"
          wrapperClassName="col-xs-8 col-xs-offset-4"
          checked={this.props.value.get('subfolders')}
          onChange={function(e) {
            props.onChange(props.value.set('subfolders', e.target.checked));
          }}
          disabled={this.props.disabled}
          help={(<span>Download subfolders recursively.</span>)}
          />
        <Input
          type="checkbox"
          label="New Files Only"
          wrapperClassName="col-xs-8 col-xs-offset-4"
          checked={this.props.value.get('newFilesOnly')}
          onChange={function(e) {
            props.onChange(props.value.set('newFilesOnly', e.target.checked));
          }}
          disabled={this.props.disabled}
          help={(<span>Every job stores the timestamp of the last downloaded file and a subsequent job can pick up from there.</span>)}
          />
        <Input
          type="checkbox"
          label="Decompress"
          wrapperClassName="col-xs-8 col-xs-offset-4"
          checked={this.props.value.get('decompress')}
          onChange={function(e) {
            props.onChange(props.value.set('decompress', e.target.checked));
          }}
          disabled={this.props.disabled}
          help={(<span>Decompress downloaded file(s). Please note, ZIP files can contain multiple files, which can lead to ambiguity. We recommend using GZIP only.</span>)}
          />
        <h3>Save Settings</h3>
        <Input
          type="text"
          label="Table Name"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.value.get('name')}
          onChange={function(e) {
            props.onChange(props.value.set('name', e.target.value));
          }}
          placeholder="mytable"
          disabled={this.props.disabled}
          help={(<span>Name of the table stored in Storage.</span>)}
          />
        <Input
          type="checkbox"
          label="Incremental Load"
          wrapperClassName="col-xs-8 col-xs-offset-4"
          checked={this.props.value.get('incremental')}
          onChange={function(e) {
            props.onChange(props.value.set('incremental', e.target.checked));
          }}
          help={(<span>If incremental load is turned on, table will be updated instead of rewritten. Tables with primary key will update rows, tables without primary key will append rows.</span>)}
          disabled={this.props.disabled}
          />
        <CsvDelimiterInput
          type="text"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.value.get('delimiter')}
          onChange={function(value) {
            props.onChange(props.value.set('delimiter', value));
          }}
          disabled={this.props.disabled}
          />
        <Input
          type="text"
          label="Enclosure"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.value.get('enclosure')}
          onChange={function(e) {
            props.onChange(props.value.set('enclosure', e.target.value));
          }}
          placeholder={'"'}
          disabled={this.props.disabled}
          help={(<span>Field enclosure used in CSV file. Default value is <code>"</code>.</span>)}
          />
        <h3>Headers &amp; Primary Key</h3>
        <div className="form-group">
          <div className="col-xs-4 control-label">Read Headers</div>
          <div className="col-xs-8">
            <Select
              name="columnsFrom"
              value={this.props.value.get('columnsFrom')}
              multi={false}
              allowCreate={false}
              emptyStrings={false}
              searchable={false}
              clearable={false}
              options={columnsFromOptions}
              onChange={function(value) {
                let newValue = props.value.set('columnsFrom', value);
                if (value !== 'manual') {
                  newValue = newValue.set('columns', Immutable.fromJS([]));
                }
                props.onChange(newValue);
              }}
            />
          </div>
        </div>
        {this.props.value.get('columnsFrom') === 'manual' &&
          <div className="form-group">
            <div className="col-xs-4 control-label">Set Headers</div>
            <div className="col-xs-8">
              <Select
                name="columns"
                value={this.props.value.get('columns').toJS()}
                multi={true}
                allowCreate={true}
                delimiter=","
                placeholder="Add a column"
                emptyStrings={false}
                onChange={function(value) {
                  props.onChange(props.value.set('columns', Immutable.fromJS(value)));
                }}
              />
            </div>
          </div>
        }
        <div className="form-group">
          <div className="col-xs-4 control-label">Primary Key</div>
          <div className="col-xs-8">
            <Select
              name="primaryKey"
              value={this.props.value.get('primaryKey').toJS()}
              multi={true}
              allowCreate={true}
              delimiter=","
              placeholder="Add a column to the primary key"
              emptyStrings={false}
              onChange={function(value) {
                props.onChange(props.value.set('primaryKey', Immutable.fromJS(value)));
              }}
            />
            <div className="help-block">If primary key is set, updates can be done on table by selecting <strong>incremental loads</strong>. Primary key can consist of multiple columns. Primary key of an existing table cannot be changed.</div>
          </div>
        </div>
      </div>
    );
  }
});
