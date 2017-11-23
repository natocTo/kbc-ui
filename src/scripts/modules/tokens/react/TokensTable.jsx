import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';
import {List, Map} from 'immutable';
import {Check} from 'kbc-react-components';
import moment from 'moment';
import Tooltip from '../../../react/common/Tooltip';
import Confirm from '../../../react/common/Confirm';
import {Loader} from 'kbc-react-components';
import RefreshTokenModal from './RefreshTokenModal';
import ManageTokenModal from './ManageTokenModal';

export default React.createClass({

  propTypes: {
    tokens: PropTypes.object.isRequired,
    allBuckets: PropTypes.object.isRequired,
    currentAdmin: PropTypes.object.isRequired,
    onDeleteFn: PropTypes.func.isRequired,
    isDeletingFn: PropTypes.func.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    onRefreshFn: PropTypes.func.isRequired,
    isRefreshingFn: PropTypes.func.isRequired,
    saveTokenFn: PropTypes.func.isRequired,
    isSavingToken: PropTypes.bool.isRequired
  },

  render() {
    return (
      <span>
        {this.renderTokenRefreshModal()}
        {this.renderManageTokenModal()}
        <Table responsive className="table table-striped">
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Created
              </th>
              <th>
                Expires
              </th>
              <th>
                Can Read All files
              </th>
              <th>
                Component Access
              </th>
              <th>
                Buckets Permissions
              </th>
              <th>
                <button
                  onClick={() => this.updateLocalState(['manageToken', 'show'], true)}
                  className="btn btn-success"> Create Token </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.tokens.map(this.renderTableRow).toArray()}
          </tbody>
        </Table>
      </span>
    );
  },

  renderComponentsAccess(token) {
    const allAccess = token.get('canManageBuckets');
    const accessCnt = token.get('componentAccess', List()).count();
    if (allAccess) {
      return 'All components';
    }

    if (accessCnt === 0) {
      return 'No component';
    }

    return `${accessCnt} component(s)`;
  },

  renderBucketsAceess(token) {
    const allAccess = token.get('canManageBuckets');
    const accessCnt = token.get('bucketPermissions', List()).count();
    if (allAccess) {
      return 'All buckets';
    }

    if (accessCnt === 0) {
      return 'No bucket';
    }

    return `${accessCnt} bucket(s)`;
  },

  renderExpired(token) {
    const expires = token.get('expires');
    if (!expires) return 'never';
    return (
      <Tooltip placement="top" tooltip={this.formatDate(expires)}>
        <span>{moment(expires).fromNow()}</span>
      </Tooltip>
    );
  },

  formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },

  renderYoursLabel(token) {
    const adminId = token.getIn(['admin', 'id']);
    if (adminId && adminId === this.props.currentAdmin.get('id')) {
      return (
        <div className="label kbc-label-rounded-small label-primary">
          Yours
        </div>
      );
    }
    return null;
  },

  renderTokenDelete(token) {
    if (this.props.isDeletingFn(token)) {
      return <span className="btn btn-link"><Loader/></span>;
    }
    const tokenDesc = `${token.get('description')}(${token.get('id')})`;
    return (
      <Confirm
        title="Delete Token"
        text={`Do you really want to delete token ${tokenDesc}?`}
        buttonLabel="Delete"
        onConfirm={() => this.props.onDeleteFn(token)}
      >
        <Tooltip placement="top" tooltip="Delete token">
          <button className="btn btn-link">
            <i className="kbc-icon-cup" />
          </button>
        </Tooltip>
      </Confirm>
    );
  },

  renderTokenRefreshButton(token) {
    return (
      <button
        onClick={() => this.updateLocalState('refreshToken', token)}
        className="btn btn-link">
        Refresh token
      </button>
    );
  },


  renderTokenRefreshModal() {
    const token = this.props.localState.get('refreshToken', Map());
    const isRefreshing = token && this.props.isRefreshingFn(token);
    return (
      <RefreshTokenModal
        token={token}
        show={!!token.get('id')}
        onHideFn={() => this.updateLocalState('refreshToken', Map())}
        onRefreshFn={() => this.props.onRefreshFn(token)}
        isRefreshing={!!isRefreshing}
      />
    );
  },

  renderManageTokenModal() {
    const manageData = this.props.localState.get('manageToken', Map());
    const show = manageData.get('show', false);
    const token = manageData.get('token', Map());
    const tokenId = token.get('id');
    return (
      <ManageTokenModal
        allBuckets={this.props.allBuckets}
        token={token}
        isCreate={!tokenId}
        show={show}
        onHideFn={() => this.updateLocalState(['manageToken'], Map())}
        onSaveFn={(newToken) => this.props.saveTokenFn(tokenId, newToken)}
        isSaving={this.props.isSavingToken}
      />
    );
  },

  renderEditTokenButton(token) {
    const manageData = Map({
      token: token,
      show: true
    });
    return (
      <button
        onClick={() => this.updateLocalState('manageToken', manageData)}
        className="btn btn-link">
        Edit token
      </button>
    );
  },

  updateLocalState(path, newValue) {
    const newls = this.props.localState.setIn([].concat(path), newValue);
    this.props.updateLocalState(newls);
  },

  renderTableRow(token) {
    return (
      <tr key={token.get('id')}>
        <td>
          {token.get('description')}
          {' '}
          {this.renderYoursLabel(token)}
        </td>
        <td>
          {this.formatDate(token.get('created'))}
        </td>
        <td>
          {this.renderExpired(token)}
        </td>
        <td>
          <Check isChecked={token.get('canReadAllFileUploads')} />
        </td>
        <td>
          {this.renderComponentsAccess(token)}
        </td>
        <td>
          {this.renderBucketsAceess(token)}
        </td>
        <td>
          <ul>
            <li> {this.renderEditTokenButton(token)}</li>
            <li> token detail</li>
            <li> {this.renderTokenDelete(token)}</li>
            <li> {this.renderTokenRefreshButton(token)}</li>
            <li> share/send token</li>
            <li> copy to cliboard/show</li>
          </ul>

        </td>
      </tr>
    );
  }
});
