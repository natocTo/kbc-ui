import React from 'react';
import ApplicationStore from '../../../../stores/ApplicationStore';
import TokensStore from '../../StorageTokensStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import TokensTable from './TokensTable';
import TokensActions from '../../actionCreators';
import {Map} from 'immutable';
import BucketsStore from '../../../components/stores/StorageBucketsStore';
import SettingsTabs from '../../../../react/layout/SettingsTabs';

export default React.createClass({
  mixins: [createStoreMixin(TokensStore, BucketsStore)],

  getStateFromStores() {
    const tokens = TokensStore.getAll();
    const currentAdmin = ApplicationStore.getCurrentAdmin();
    return {
      tokens: tokens,
      currentAdmin,
      isDeletingTokenFn: TokensStore.isDeletingToken,
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

  updateLocalState(key, newValue) {
    TokensActions.updateLocalState(this.state.localState.set(key, newValue));
  }

});
