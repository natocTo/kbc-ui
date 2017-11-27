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

export default React.createClass({
  mixins: [createStoreMixin(TokensStore, BucketsStore)],

  getStateFromStores() {
    const tokenId = RoutesStore.getCurrentRouteParam('tokenId');
    const tokens = TokensStore.getAll();
    const token = tokens.find(t => t.get('id') === tokenId);
    const lsPath = ['TokenDetail', tokenId];
    const localState = TokensStore.localState();
    const tokenDetailState = localState.getIn(lsPath, Map());
    const dirtyToken = tokenDetailState.get('dirtyToken', token);
    const updateLocalState = (key, value) => {
      const newLs = localState.setIn(lsPath.concat(key), value);
      TokensActions.updateLocalState(newLs);
    };
    const resetDirtyToken = () => {
      const newLs = localState
        .deleteIn(lsPath.concat('dirtyToken'))
        .setIn(lsPath.concat('saveLabel'), 'Updated');
      TokensActions.updateLocalState(newLs);
    };
    const updateDirtyToken = (key, value) => {
      const newDirtyToken = dirtyToken.setIn([].concat(key), value);
      const newLs = localState
        .setIn(lsPath.concat('dirtyToken'), newDirtyToken)
        .setIn(lsPath.concat('saveLabel'), 'Update');
      TokensActions.updateLocalState(newLs);
    };

    const saveLabel = tokenDetailState.get('saveLabel', 'Update');
    return {
      saveLabel: saveLabel,
      token: token,
      tokenId: tokenId,
      dirtyToken: dirtyToken,
      isSaving: tokenDetailState.get('isSaving', false),
      allBuckets: BucketsStore.getAll(),
      updateLocalState: updateLocalState,
      updateDirtyToken: updateDirtyToken,
      resetDirtyToken: resetDirtyToken
    };
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
              updateToken={this.state.updateDirtyToken}
            />
          </div>
          <div className="row text-right">
            <ConfirmButtons
              isDisabled={!this.isValid() || this.state.token === this.state.dirtyToken}
              isSaving={this.state.isSaving}
              onSave={this.handleSaveToken}
              onCancel={this.handleClose}
              placement="right"
              cancelLabel={'todo: cancel or back'}
              saveLabel={this.state.saveLabel}
            />
          </div>n
        </div>
      </div>
    );
  },

  handleClose() {

  },

  isValid() {
    const {dirtyToken} = this.state;
    const expiresIn = dirtyToken.get('expiresIn');
    const validExpiresIn = expiresIn !== 0;
    return !!dirtyToken.get('description') && validExpiresIn;
  },


  handleSaveToken() {
    const tokenId = this.state.tokenId;
    this.state.updateLocalState('isSaving', true);
    return TokensActions.updateToken(tokenId, this.state.dirtyToken.toJS()).then(() => {
      this.state.updateLocalState('isSaving', false);
      this.state.resetDirtyToken();
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
