import React from 'react';

// stores
import ComponentStore from '../../../components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import storeProvisioning from '../../stores/credentials';

// actions
import actionsProvisioning from '../../actions/credentials';

// specific components
import Credentials from '../components/Credentials';

// global components
import ComponentDescription from '../../../components/react/components/ComponentDescription';
import ComponentMetadata from '../../../components/react/components/ComponentMetadata';
import SaveButtons from '../../../../react/common/SaveButtons';
import {Link} from 'react-router';

// css
import './Credentials.less';

// CONSTS
const COMPONENT_ID = 'keboola.ex-aws-s3';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore)],

  getStateFromStores() {
    const configId = RoutesStore.getCurrentRouteParam('config');
    const component = ComponentStore.getComponent(COMPONENT_ID);
    const store = storeProvisioning(configId);
    const actions = actionsProvisioning(configId);
    return {
      component: component,
      configId: configId,
      actions: actions,
      localState: store.getLocalState(),
      credentials: store.credentials
    };
  },

  renderButtons() {
    return (
      <div className="text-right">
        <SaveButtons
          isSaving={this.state.localState.get('isSaving', false)}
          isChanged={this.state.localState.get('isChanged', false)}
          onSave={this.state.actions.editSave}
          onReset={this.state.actions.editReset}
            />
      </div>
    );
  },

  renderCredentials() {
    return (
      <Credentials
        awsAccessKeyId={this.state.credentials.get('awsAccessKeyId')}
        awsSecretAccessKey={this.state.credentials.get('awsSecretAccessKey')}
        onChange={this.state.actions.editChange}
        disabled={this.state.localState.get('isSaving', false)}
      />
    );
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <ComponentDescription
              componentId={COMPONENT_ID}
              configId={this.state.configId}
            />
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            <h3>TODO</h3>
            <ul>
              <li>Content of the right bar</li>
              <li>Back button? Navigation back?</li>
            </ul>
          </div>
          <div className="kbc-inner-content-padding-fix with-bottom-border">
            {this.renderButtons()}
            {this.renderCredentials()}
          </div>
        </div>
        <div className="col-md-3 kbc-main-sidebar">
          <ComponentMetadata
            componentId={COMPONENT_ID}
            configId={this.state.configId}
          />
          <ul className="nav nav-stacked">
            <li>
              <Link to={COMPONENT_ID} params={{config: this.state.configId}}>
                <span className="fa fa-arrow-left fa-fw" />
                &nbsp;Back
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
