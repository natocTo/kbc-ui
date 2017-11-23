import React, {PropTypes} from 'react';
import Select from 'react-select';
// import {fromJS} from 'immutable';
// import {ListGroupItem, ListGroup} from 'react-bootstrap';
// import {Table, Panel} from 'react-bootstrap';

export default React.createClass({

  propTypes: {
    onChange: PropTypes.func.isRequired,
    bucketPermissions: PropTypes.object.isRequired,
    allBuckets: PropTypes.object.isRequired,
    wrapperClassName: PropTypes.string
  },

  getInitialState() {
    return ({
      selectedBucket: null,
      selectedPermission: 'read'
    });
  },

  permissionOptions: [{label: 'read', value: 'read'}, {label: 'write', value: 'write'}],

  render() {
    return (
      <div className={this.props.wrapperClassName}>
        <div className="row">
          {this.renderSelectedPermissions()}
        </div>
        <div className="well">
          {this.renderAddingRow()}
        </div>
      </div>
    );
  },

  renderAddingRow() {
    return (
      <div className="row">
        <span className="col-sm-7">
          <Select
            placeholder="Select bucket..."
            value={this.state.selectedBucket}
            onChange={({value}) => this.setState({selectedBucket: value})}
            options={this.getOptions()}
          />
        </span>
        <span className="col-sm-2">
          <Select
            placeholder="Select permission"
            value={this.state.selectedPermission}
            onChange={({value}) => this.setState({selectedPermission: value})}
            clearable={false}
            searchable={false}
            options={this.permissionOptions}
          />
        </span>
        <span className="col-sm-3">
          <button
            onClick={this.addSelectedPermission}
            disabled={!this.state.selectedPermission || !this.state.selectedBucket}
            className="btn btn-success">
            Add Permission
          </button>
        </span>
      </div>
    );
  },

  renderSelectedPermissions() {
    if (this.props.bucketPermissions.count() === 0) {
      return (
        <span className="col-sm-12">
          <p><small>No buckets permissions added</small></p>
        </span>
      );
    }
    return (
      <span>
        {this.props.bucketPermissions.map((permission, bucketId) =>
          <div className="row" key={bucketId} style={{paddingBottom: '8px'}}>
            <div className="col-sm-12">
              <span className="col-sm-8">{bucketId}</span>
              <span className="col-sm-2">
                <Select
                  value={permission}
                  onChange={({value}) => this.updatePermission(bucketId, value)}
                  clearable={false}
                  searchable={false}
                  options={this.permissionOptions}
                />
              </span>
              <span className="col-sm-2">
                <button
                  onClick={() => this.removeBucket(bucketId)}
                  className="btn btn-link">
                  <i className="kbc-icon-cup" />
                </button>
              </span>
            </div>
          </div>
        ).toArray()
        }
      </span>
    );
  },


  removeBucket(bucketId) {
    this.props.onChange(this.props.bucketPermissions.delete(bucketId));
  },

  updatePermission(bucketId, permission) {
    this.props.onChange(this.props.bucketPermissions.set(bucketId, permission));
  },

  addSelectedPermission() {
    this.updatePermission(this.state.selectedBucket, this.state.selectedPermission);
  },


  getOptions() {
    return this.props.allBuckets
               .filter((b, bid) => !this.props.bucketPermissions.has(bid))
               .map((b, bid) => ({label: bid, value: bid})).toArray();
  }

});
