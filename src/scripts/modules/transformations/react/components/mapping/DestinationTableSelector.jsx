import React, {PropTypes} from 'react';
import Select from 'react-select';
import {FormGroup, HelpBlock} from 'react-bootstrap';
import tableIdParser from '../../../../../utils/tableIdParser';
// import storageActions from '../../../../components/StorageActionCreators';

export default React.createClass({
  propTypes: {
    onSelect: PropTypes.func.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    tables: React.PropTypes.object.isRequired,
    buckets: React.PropTypes.object.isRequired,
    prefillTableValue: React.PropTypes.string
  },

  /* componentDidMount() {
   *   storageActions.loadTablesForce();
   * },*/

  parse() {
    return tableIdParser.parse(this.props.value, {defaultStage: 'out'});
  },

  prepareBucketsOptions() {
    const stage = this.parse().parts.stage;
    const bucket = this.parse().parts.bucket;
    const buckets = this.props.buckets
                        .filter(b => b.get('stage') === stage)
                        .map(b => ({label: b.get('name'), value: b.get('name')}))
                        .toList();
    if (!!bucket && !buckets.find(b => b.label === bucket)) {
      return buckets.push({label: bucket, value: bucket});
    } else {
      return buckets;
    }
  },

  prepareTablesOptions() {
    const parsed = this.parse().parts;
    const bucketId = parsed.stage + '.' + parsed.bucket;
    const table = parsed.table;
    const tables = this.props.tables
                       .filter(t => t.getIn(['bucket', 'id']) === bucketId)
                       .map(t => ({label: t.get('name'), value: t.get('name')}))
                       .toList();
    if (!!table && !tables.find(t => t.label === table)) {
      return tables.push({label: table, value: table});
    } else {
      return tables;
    }
  },

  render() {
    const parsed = this.parse().parts;
    return (
      <FormGroup>
        <span className="col-sm-2" style={{paddingLeft: '0px'}}>
          <Select
            searchable={false}
            disabled={this.props.disabled}
            clearable={false}
            value={parsed.stage}
            onChange={({value}) => this.selectStage(value)}
            options={['out', 'in'].map(v => ({label: v, value: v}))}
          />
        </span>
        <span className="col-sm-6" style={{paddingLeft: '0px'}}>
          <Select.Creatable
            promptTextCreator={label => `Create new bucket ${label}`}
            clearable={true}
            disabled={this.props.disabled}
            placeholder="Select bucket or create new"
            value={parsed.bucket}
            onChange={this.selectBucket}
            options={this.prepareBucketsOptions().toJS()}
          />
        </span>
        <span className="col-sm-4" style={{paddingLeft: '0px', paddingRight: '0px'}}>
          <Select.Creatable
            promptTextCreator={label => `Create new table ${label}`}
            clearable={true}
            disabled={this.props.disabled}
            placeholder="Select table or create new"
            value={parsed.table}
            onChange={this.selectTable}
            options={this.prepareTablesOptions().toJS()}
          />
        </span>
        <HelpBlock> Destination is table in storage - you can create new one or use existing.</HelpBlock>
      </FormGroup>
    );
  },

  selectStage(stage) {
    this.updateValue('stage', stage);
  },

  selectBucket(selection) {
    const bucket = selection ? selection.value : '';
    this.updateValue('bucket', bucket);
  },

  selectTable(selection) {
    const tableName = selection ? selection.value : '';
    this.updateValue('table', tableName);
  },

  updateValue(partNameToUpdate, value) {
    const result = this.parse().setPart(partNameToUpdate, value);
    this.props.onSelect(result.tableId);
  }

});
