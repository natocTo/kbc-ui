import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';
import {List} from 'immutable';
import {Check} from 'kbc-react-components';
import moment from 'moment';
import Tooltip from '../../../react/common/Tooltip';
import Confirm from '../../../react/common/Confirm';
import {Loader} from 'kbc-react-components';

export default React.createClass({

  propTypes: {
    tokens: PropTypes.object.isRequired,
    currentAdmin: PropTypes.object.isRequired,
    onDeleteFn: PropTypes.func.isRequired,
    isDeletingFn: PropTypes.func.isRequired
  },

  render() {
    return (
      <Table responsive className="table table-striped">
        <thead>
          <tr>
            <th>
              id
            </th>
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
              <button className="btn btn-success"> Create Token </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.tokens.map(this.renderTableRow).toArray()}
        </tbody>
      </Table>
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

  renderTableRow(token) {
    return (
      <tr key={token.get('id')}>
        <td>
          {token.get('id')}
        </td>
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
            <li> edit token</li>
            <li> token detail</li>
            <li> {this.renderTokenDelete(token)}</li>
            <li> refresh token</li>
            <li> share/send token</li>
            <li> copy to cliboard/show</li>
          </ul>

        </td>
      </tr>
    );
  }
});
