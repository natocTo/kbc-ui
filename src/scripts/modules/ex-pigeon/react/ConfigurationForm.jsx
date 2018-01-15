import React, {PropTypes} from 'react';

import storeProvisioning, {storeMixins} from '../storeProvisioning';
import RoutesStore from '../../../stores/RoutesStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import actionsProvisioning from '../actionsProvisioning';
import {RefreshIcon} from '@keboola/indigo-ui';

export default React.createClass({

  mixins: [createStoreMixin(...storeMixins)],

  getStateFromStores() {
    const componentId = 'keboola.ex-pigeon';
    const configId = RoutesStore.getCurrentRouteParam('config');
    const actions = actionsProvisioning(configId, componentId);
    const store = storeProvisioning(configId, componentId);

    return {
      store: store,
      actions: actions,
      configId: configId,
      localState: store.getLocalState()
    };
  },
  propTypes: {
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    onSave: PropTypes.func.isRequired
  },
  componentDidMount() {
    this.state.actions.requestEmail();
  },
  render() {
    const isLoading = this.state.localState.get('isLoading', true);
    if (isLoading) {
      return <RefreshIcon isLoading={isLoading}/>;
    } else {
      return (<div>{this.state.localState.get('requestedEmail')}</div>);
    }
  }
});
