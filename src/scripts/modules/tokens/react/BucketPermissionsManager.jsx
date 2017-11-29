import React, {PropTypes} from 'react';
import Select from 'react-select';
// import {fromJS} from 'immutable';
// import {ListGroupItem, ListGroup} from 'react-bootstrap';
import {Table, Panel} from 'react-bootstrap';

export default React.createClass({

  propTypes: {
    disabled: PropTypes.bool.isRequired,
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

  permissionOptions: [{label: 'read', value: 'read'}, {label: 'write', value: 'write'}, {label: 'manage', value: 'manage', disabled: true}],

  render() {
    return (
      <div className={this.props.wrapperClassName}>
        {this.renderSelectedPermissions()}
        <div className="well" fstyle={{margin: '0'}}>
          {this.renderAddingRow()}
        </div>
      </div>
    );
  },

  renderAddingRow() {
    return (
      <span className="row">
        <span className="col-sm-12">
          <span className="col-sm-8" style={{padding: '0px'}}>
            <Select
              disabled={this.props.disabled}
              placeholder="Select bucket..."
              value={this.state.selectedBucket}
              onChange={({value}) => this.setState({selectedBucket: value})}
              options={this.getOptions()}
            />
          </span>
          <span className="col-sm-3" style={{paddingRight: '11px', paddingLeft: '16px'}}>
            <Select
              disabled={this.props.disabled}
              placeholder="Select permission"
              value={this.state.selectedPermission}
              onChange={({value}) => this.setState({selectedPermission: value})}
              clearable={false}
              searchable={false}
              options={this.permissionOptions}
            />
          </span>
          <span className="col-sm-1">
            <button
              onClick={this.addSelectedPermission}
              disabled={!this.state.selectedPermission || !this.state.selectedBucket}
              className="btn btn-success">
              Add
            </button>
          </span>
        </span>
      </span>
    );
  },

  renderSelectedPermissions() {
    if (this.props.bucketPermissions.count() === 0) {
      return (
        <span>
          <p><small>No buckets permissions added</small></p>
        </span>
      );
    }
    return (
      <span>
        <Panel
          header="Buckets Permissions"
          collapsible={true} defaultExpanded={true}>
          <Table fill className="table">
            <tbody>
              {this.props.bucketPermissions.map((permission, bucketId) =>
                <tr key={bucketId}>
                  <td>
                    <span className="col-sm-8">{bucketId}</span>
                    <span className="col-sm-3">
                      <Select
                        value={permission}
                        onChange={({value}) => this.updatePermission(bucketId, value)}
                        clearable={false}
                        searchable={false}
                        options={this.permissionOptions}
                      />
                    </span>
                    <span className="col-sm-1">
                      <button
                        onClick={() => this.removeBucket(bucketId)}
                        className="btn btn-link ">
                        <i className="kbc-icon-cup" />
                      </button>
                    </span>

                  </td>
                </tr>

              ).toArray()
              }
            </tbody>
          </Table>
        </Panel>
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
    this.setState({selectedBucket: null});
  },


  getOptions() {
    return this.props.allBuckets
               .filter((b, bid) => !this.props.bucketPermissions.has(bid))
               .map((b, bid) => ({label: bid, value: bid})).toArray();
  }

});
