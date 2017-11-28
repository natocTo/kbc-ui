import React from 'react';
import {Link} from 'react-router';
import ApplicationStore from '../../../stores/ApplicationStore';
import TokensStore from '../StorageTokensStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import TokenEditor from './TokenEditor';
import TokensActions from '../actionCreators';
import {Map} from 'immutable';
import BucketsStore from '../../components/stores/StorageBucketsStore';
import RoutesStore from '../../../stores/RoutesStore';
import ConfirmButtons from '../../../react/common/ConfirmButtons';

const makeDetailPath = (tokenId) => (rest) => ['TokenDetail', tokenId].concat(rest || []);

export default React.createClass({
  mixins: [createStoreMixin(TokensStore, BucketsStore)],

  getStateFromStores() {
    const tokenId = RoutesStore.getCurrentRouteParam('tokenId');
    const tokens = TokensStore.getAll();
    const token = tokens.find(t => t.get('id') === tokenId);
    const path = makeDetailPath(tokenId);
    const localState = TokensStore.localState();
    const tokenDetailState = localState.getIn(path(), Map());

    const dirtyToken = tokenDetailState.get('dirtyToken', token);
    const saveLabel = tokenDetailState.get('saveLabel', 'Update');
    const cancelLabel = tokenDetailState.get('cancelLabel', 'Back To Tokens Page');
    const isSaving = tokenDetailState.get('isSaving', false);

    return {
      localState: localState,
      token: token,
      tokenId: tokenId,
      dirtyToken: dirtyToken,
      saveLabel: saveLabel,
      cancelLabel: cancelLabel,
      isSaving: isSaving,
      allBuckets: BucketsStore.getAll()
    };
  },

  updateLocalState(key, value) {
    const path = makeDetailPath(this.state.tokenId);
    const newLs = this.state.localState.setIn(path(key), value);
    TokensActions.updateLocalState(newLs);
  },

  resetDirtyToken(isUpdated) {
    const path = makeDetailPath(this.state.tokenId);
    const {localState} = this.state;
    const newLs = localState
      .deleteIn(path('dirtyToken'))
      .setIn(path('saveLabel'), isUpdated ? 'Updated' : 'Update')
      .setIn(path('cancelLabel'), 'Back To Tokens Page');
    TokensActions.updateLocalState(newLs);
  },

  updateDirtyToken(key, value) {
    const path = makeDetailPath(this.state.tokenId);
    const {localState} = this.state;
    const newDirtyToken = this.state.dirtyToken.setIn([].concat(key), value);
    const newLs = localState
      .setIn(path('dirtyToken'), newDirtyToken)
      .setIn(path('saveLabel'), 'Update')
      .setIn(path('cancelLabel'), 'Cancel');
    TokensActions.updateLocalState(newLs);
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="kbc-main-content">
          {this.renderTabs()}
          <div className="row">
            <TokenEditor
              disabled={this.state.isSaving}
              isEditting={true}
              token={this.state.dirtyToken}
              allBuckets={this.state.allBuckets}
              updateToken={this.updateDirtyToken}
            />
          </div>
          <div className="row text-right">
            <ConfirmButtons
              isDisabled={!this.isValid() || this.state.token === this.state.dirtyToken}
              isSaving={this.state.isSaving}
              onSave={this.handleSaveToken}
              onCancel={this.handleClose}
              placement="right"
              cancelLabel={this.state.cancelLabel}
              saveLabel={this.state.saveLabel}
            />
          </div>
        </div>
      </div>
    );
  },

  handleClose() {
    if (this.state.cancelLabel === 'Cancel') {
      this.resetDirtyToken(false);
    } else {
      RoutesStore.getRouter().transitionTo('tokens');
    }
  },

  isValid() {
    const {dirtyToken} = this.state;
    const expiresIn = dirtyToken.get('expiresIn');
    const validExpiresIn = expiresIn !== 0;
    return !!dirtyToken.get('description') && validExpiresIn;
  },


  handleSaveToken() {
    const tokenId = this.state.tokenId;
    this.updateLocalState('isSaving', true);
    return TokensActions.updateToken(tokenId, this.state.dirtyToken.toJS()).then(() => {
      this.updateLocalState('isSaving', false);
      this.resetDirtyToken(true);
    });
  },

  renderTabs() {
    return (
      <ul className="nav nav-tabs">
        <li role="presentation">
          <a href={this.projectPageUrl('settings-users')}>Users</a>
        </li>
        <li role="presentation">
          <a href={this.projectPageUrl('settings')}>Settings</a>
        </li>
        <li role="presentation">
          <Link to="settings-limits">Limits</Link>
        </li>
        <li role="presentation">
          <Link to="settings-project-power">Project Power</Link>
        </li>
        <li role="presentation">
          <Link to="settings-trash">Trash</Link>
        </li>
        <li role="presentation" className="active">
          <Link to="tokens">Tokens</Link>
        </li>
      </ul>
    );
  },

  projectPageUrl(path) {
    return ApplicationStore.getProjectPageUrl(path);
  }

});
