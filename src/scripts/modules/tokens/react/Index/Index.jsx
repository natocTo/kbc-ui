import React from 'react';
import ApplicationStore from '../../../../stores/ApplicationStore';
import TokensStore from '../../StorageTokensStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import TokensTable from './TokensTable';
import TokensActions from '../../actionCreators';
import {Map} from 'immutable';
import BucketsStore from '../../../components/stores/StorageBucketsStore';
import SettingsTabs from '../../../../react/layout/SettingsTabs';
import ApplicationActionCreators from '../../../../actions/ApplicationActionCreators';

export default React.createClass({
  mixins: [createStoreMixin(TokensStore, BucketsStore)],

  getStateFromStores() {
    const tokens = TokensStore.getAll();
    const currentAdmin = ApplicationStore.getCurrentAdmin();
    return {
      tokens: tokens,
      currentAdmin,
      isDeletingTokenFn: TokensStore.isDeletingToken,
      isSendingToken: TokensStore.isSendingToken,
      isRefreshingTokenFn: TokensStore.isRefreshingToken,
      localState: TokensStore.localState(),
      allBuckets: BucketsStore.getAll()
    };
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="kbc-main-content">
          <SettingsTabs active="tokens" />
          <TokensTable
            localState={this.state.localState.get('TokensTable', Map())}
            updateLocalState={(newState) => this.updateLocalState('TokensTable', newState)}
            isDeletingFn={t => this.state.isDeletingTokenFn(t.get('id'))}
            onDeleteFn={TokensActions.deleteToken}
            onSendTokenFn={this.sendToken}
            isSendingTokenFn={this.state.isSendingToken}
            onRefreshFn={TokensActions.refreshToken}
            isRefreshingFn={t => this.state.isRefreshingTokenFn(t.get('id'))}
            currentAdmin={this.state.currentAdmin}
            tokens={this.state.tokens}
            allBuckets={this.state.allBuckets}
          />
        </div>
      </div>
    );
  },

  sendToken(token, params) {
    return TokensActions.sendToken(token.get('id'), params).then(() =>
      ApplicationActionCreators.sendNotification({
        message: `Token ${token.get('description')} sent to ${params.email}`
      }));
  },

  updateLocalState(key, newValue) {
    TokensActions.updateLocalState(this.state.localState.set(key, newValue));
  }

});
