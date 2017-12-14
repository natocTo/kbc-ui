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
    const saveLabel = tokenDetailState.get('saveLabel', 'Save');
    const isSaving = tokenDetailState.get('isSaving', false);
    const eventsApi = createTokenEventsApi(tokenId);

    return {
      localState: localState,
      token: token,
      tokenId: tokenId,
      dirtyToken: dirtyToken,
      saveLabel: saveLabel,
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
                 <TokenEditor
                   disabled={this.state.isSaving}
                   isEditing={true}
                   token={this.state.dirtyToken}
                   allBuckets={this.state.allBuckets}
                   updateToken={this.updateDirtyToken}
                 />
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
           :
           <div className="text-center">
             Token {this.state.tokenId} does not exist or has been removed.
           </div>
          }
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


  handleSaveToken() {
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
