import React, {PropTypes} from 'react';
import Select from 'react-select';
// import {fromJS} from 'immutable';

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
      selectedPermission: null
    });
  },

  permissionOptions: [{label: 'read', value: 'read'}, {label: 'write', value: 'write'}],

  render() {
    return (
      <div className={this.props.wrapperClassName}>
        {this.renderSelectedPermissions()}
        <Select
          value={this.state.selectedBucket}
          onChange={({value}) => this.setState({selectedBucket: value})}
          options={this.getOptions()}
        />
        <Select
          value={this.state.selectedPermission}
          onChange={({value}) => this.setState({selectedPermission: value})}
          clearable={false}
          searchable={false}
          options={this.permissionOptions}
        />
        <button
          onClick={this.addSelectedPermission}
          disabled={!this.state.selectedPermission || !this.state.selectedBucket}
          className="btn btn-link btn-sm">
          Add
        </button>
      </div>
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

  renderSelectedPermissions() {
    return (
      <table>
        <tbody>
          {this.props.bucketPermissions.map((permission, bucketId) =>
            <tr key={bucketId}>
              <td>{bucketId}</td>
              <td>
                <Select
                  value={permission}
                  onChange={({value}) => this.updatePermission(bucketId, value)}
                  clearable={false}
                  searchable={false}
                  options={this.permissionOptions}
                />
              </td>
              <td><button onClick={() => this.removeBucket(bucketId)}
                    className="btn btn-link">remove</button></td>
            </tr>
          ).toArray()}
        </tbody>
      </table>
    );
  },

  getOptions() {
    return this.props.allBuckets
               .filter((b, bid) => !this.props.bucketPermissions.has(bid))
               .map((b, bid) => ({label: bid, value: bid})).toArray();
  }

});
