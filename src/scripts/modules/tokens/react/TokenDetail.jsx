import React from 'react';
import TokensStore from '../StorageTokensStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import TokenEditor from './tokenEditor/TokenEditor';
import TokensActions from '../actionCreators';
import {Map} from 'immutable';
import BucketsStore from '../../components/stores/StorageBucketsStore';
import RoutesStore from '../../../stores/RoutesStore';
import {Tabs, Tab} from 'react-bootstrap';
import Events from '../../sapi-events/react/Events';
import createTokenEventsApi from '../TokenEventsApi';
import SaveButtons from '../../../react/common/SaveButtons';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import TokenString from './Index/TokenString';

const makeDetailPath = (tokenId) => (rest) => ['TokenDetail', tokenId].concat(rest || []);

export default React.createClass({
  mixins: [createStoreMixin(TokensStore, BucketsStore)],

  getStateFromStores() {
    const tokenId = RoutesStore.getCurrentRouteParam('tokenId');
    const isNew = tokenId === 'new-token';
    const tokens = TokensStore.getAll();
    const token = !isNew && tokens.find(t => t.get('id') === tokenId);
    const path = makeDetailPath(tokenId);
    const localState = TokensStore.localState();
    const tokenDetailState = localState.getIn(path(), Map());
    const dirtyToken = tokenDetailState.get('dirtyToken', token || Map());
    const isSaving = tokenDetailState.get('isSaving', false);
    const eventsApi = !isNew && createTokenEventsApi(tokenId);

    return {
      localState: localState,
      isNew: isNew,
      token: token,
      tokenId: tokenId,
      dirtyToken: dirtyToken,
      isSaving: isSaving,
      allBuckets: BucketsStore.getAll(),
      eventsApi: eventsApi
    };
  },

  updateLocalState(key, value) {
    const path = makeDetailPath(this.state.tokenId);
    const newLs = this.state.localState.setIn(path(key), value);
    TokensActions.updateLocalState(newLs);
  },

  resetDirtyToken() {
    const path = makeDetailPath(this.state.tokenId);
    const {localState} = this.state;
    const newLs = localState.deleteIn(path('dirtyToken'));
    TokensActions.updateLocalState(newLs);
  },

  updateDirtyToken(key, value) {
    const path = makeDetailPath(this.state.tokenId);
    const {localState} = this.state;
    const newDirtyToken = this.state.dirtyToken.setIn([].concat(key), value);
    const newLs = localState.setIn(path('dirtyToken'), newDirtyToken);
    TokensActions.updateLocalState(newLs);
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="kbc-main-content">
          {this.state.token ?
           <Tabs id="token-detail-tabs" animation={false}>
             <Tab title="Overview" eventKey="overview">
               <div className="row kbc-header">
                 <div className="kbc-buttons">
                   <div className="col-sm-12">
                     <SaveButtons
                       isSaving={this.state.isSaving}
                       disabled={!this.isValid()}
                       isChanged={this.state.token !== this.state.dirtyToken}
                       onSave={this.handleSaveToken}
                       onReset={this.handleClose}
                     />
                   </div>
                 </div>
               </div>
               <div>
                 {this.renderTokenEditor(true)}
               </div>
             </Tab>
             <Tab title="Events" eventKey="events">
               <Events
                 eventsApi={this.state.eventsApi}
                 autoReload={true}
                 link={{to: 'tokens-detail', params: {tokenId: this.state.tokenId}}}
               />
             </Tab>
           </Tabs>
           : this.renderNewToken()
          }
        </div>
      </div>
    );
  },

  renderTokenEditor(isEditing) {
    return (
      <TokenEditor
        disabled={!!this.state.isSaving || !!this.state.createdToken}
        isEditing={isEditing}
        token={this.state.dirtyToken}
        allBuckets={this.state.allBuckets}
        updateToken={this.updateDirtyToken}
      />
    );
  },

  renderTokenCreated() {
    if (!this.state.createdToken) return null;

    return (
      <div>
        <p className="alert alert-success">Token {this.state.createdToken.get('description')} has been created. Make sure to copy it. You won't be able to see it again. </p>
        <TokenString token={this.state.createdToken} />
      </div>
    );
  },


  renderNewToken() {
    if (!this.state.isNew) {
      return (
        <div className="text-center">
          Token {this.state.tokenId} does not exist or has been removed.
        </div>
      );
    }
    return (
      <div className="row">
        {this.renderTokenCreated()}
        {!this.state.createdToken &&
         <div className="kbc-header">
           <div className="kbc-buttons">
             <ConfirmButtons
               isSaving={this.state.isSaving}
               isDisabled={!this.isValid()}
               onSave={this.handleSaveToken}
               onCancel={this.handleClose}
               saveLabel="Create"
               showCancel={false}
             />
           </div>
         </div>
        }
        <div>
          <div>
            {this.renderTokenEditor(false)}
          </div>
        </div>
      </div>
    );
  },

  prepareEventsQuery() {
    const tokenId = this.state.tokenId;
    return `token.id:${tokenId} OR (objectId:${tokenId} AND objectType:token)`;
  },

  handleClose() {
    this.resetDirtyToken();
  },

  isValid() {
    const {dirtyToken} = this.state;
    const expiresIn = dirtyToken.get('expiresIn');
    const validExpiresIn = expiresIn !== 0;
    return !!dirtyToken.get('description') && validExpiresIn;
  },

  handleCreateToken() {
    const token = this.state.dirtyToken;
    this.updateLocalState('isSaving', true);
    const cancelSaving = () => this.updateLocalState('isSaving', false);
    return TokensActions.createToken(token.toJS()).then((createdToken) => {
      cancelSaving();
      this.setState({ createdToken: createdToken});
      return createdToken;
    }).catch((e) => {
      cancelSaving();
      throw e;
    });
  },

  handleSaveToken() {
    if (this.state.isNew) {
      return this.handleCreateToken();
    }

    const tokenId = this.state.tokenId;
    this.updateLocalState('isSaving', true);
    return TokensActions.updateToken(tokenId, this.state.dirtyToken.toJS()).then(() => {
      this.updateLocalState('isSaving', false);
      this.resetDirtyToken();
    }).catch((e) => {
      this.updateLocalState('isSaving', false);
      throw e;
    });
  }
});
