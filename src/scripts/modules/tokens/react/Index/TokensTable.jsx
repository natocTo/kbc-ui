import React, {PropTypes} from 'react';
// import {Table} from 'react-bootstrap';
import {List, Map} from 'immutable';

import Tooltip from '../../../../react/common/Tooltip';
import Confirm from '../../../../react/common/Confirm';
import {Loader} from '@keboola/indigo-ui';
import RefreshTokenModal from './RefreshTokenModal';
import CreateTokenModal from './CreateTokenModal';
import ExpiresInfo from '../tokenEditor/ExpiresInfo';
import {Link} from 'react-router';
import CreatedDate from './CreatedDate';

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
        {this.renderCreateTokenModal()}
        <div className="table table-striped table-hover">
          <div className="thead">
            <div className="tr">
              <div className="th">
                Description
              </div>
              <div className="th">
                Created
              </div>
              <div className="th">
                Expires
              </div>
              <div className="th">
                Files
              </div>
              <div className="th">
                Components
              </div>
              <div className="th">
                Buckets
              </div>
              <div className="th text-right">
                <button
                  onClick={() => this.updateLocalState(['createToken', 'show'], true)}
                  className="btn btn-success">+ New Token</button>
              </div>
            </div>
          </div>
          <div className="tbody">
            {this.getSortedTokens().map(this.renderTableRow).toArray()}
          </div>
        </div>
      </span>
    );
  },

  getSortedTokens() {
    return this.props.tokens.sortBy(t => t.get('description').toLowerCase());
  },

  renderComponentsAccess(token) {
    const allAccess = token.get('canManageBuckets');
    const accessCnt = token.get('componentAccess', List()).count();
    if (allAccess) {
      return 'All components';
    }

    if (accessCnt === 0) {
      return 'None';
    }
    const pluralSuffix = accessCnt > 1 ? 's' : '';
    return `${accessCnt} component${pluralSuffix}`;
  },

  renderBucketsAccess(token) {
    const allAccess = token.get('canManageBuckets');
    const accessCnt = token.get('bucketPermissions', List()).count();
    if (allAccess) {
      return 'All buckets';
    }

    if (accessCnt === 0) {
      return 'None';
    }

    const pluralSuffix = accessCnt > 1 ? 's' : '';
    return `${accessCnt} bucket${pluralSuffix}`;
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
    const onClickButton = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.updateLocalState('refreshToken', token);
    };
    return (
      <button
        onClick={onClickButton}
        className="btn btn-link">
        <Tooltip placement="top" tooltip="Refresh token">
          <i className="fa fa-refresh" />
        </Tooltip>
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

  renderCreateTokenModal() {
    const createData = this.props.localState.get('createToken', Map());
    const show = createData.get('show', false);
    const onCloseModal = () => {
      this.updateLocalState(['createToken'], Map());
    };

    return (
      <CreateTokenModal
        allBuckets={this.props.allBuckets}
        show={show}
        onHideFn={onCloseModal}
        onSaveFn={(newToken) => this.props.saveTokenFn(newToken)}
        isSaving={this.props.isSavingToken}
      />
    );
  },

  updateLocalState(path, newValue) {
    const newls = this.props.localState.setIn([].concat(path), newValue);
    this.props.updateLocalState(newls);
  },

  renderTableRow(token) {
    return (
      <Link to="tokens-detail" params={{tokenId: token.get('id')}}
        className="tr" key={token.get('id')}>
        <div className="td">
          {token.get('description')}
          {' '}
          {this.renderYoursLabel(token)}
        </div>
        <div className="td">
          <CreatedDate token={token} />
        </div>
        <div className="td">
          <ExpiresInfo token={token} />
        </div>
        <div className="td">
          {token.get('canReadAllFileUploads') ?
           'All files'
           :
           'Own files'
          }

        </div>
        <div className="td">
          {this.renderComponentsAccess(token)}
        </div>
        <div className="td">
          {this.renderBucketsAccess(token)}
        </div>
        <div className="td text-right kbc-no-wrap">

          {!token.has('admin') && this.renderTokenDelete(token)}
          {this.renderTokenRefreshButton(token)}
        </div>
      </Link>
    );
  }
});
