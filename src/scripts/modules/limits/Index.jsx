import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import createStoreMixin from '../../react/mixins/createStoreMixin';
import LimitsSection from './LimitsSection';
import StorageApi from '../components/StorageApi';
import Keen from 'keen-js';
import SettingsTabs from '../../react/layout/SettingsTabs';

export default React.createClass({
  mixins: [createStoreMixin(ApplicationStore)],

  getInitialState() {
    return {
      client: null,
      isKeenReady: false
    };
  },

  componentDidMount() {
    StorageApi
      .getKeenCredentials()
      .then((response) => {
        const client = new Keen({
          readKey: response.keenToken,
          projectId: response.projectId
        });
        this.setState({
          client: client
        });
        Keen.ready(this.keenReady);
      });
  },

  getStateFromStores() {
    return {
      sections: ApplicationStore.getLimits(),
      canEdit: ApplicationStore.getKbcVars().get('canEditProjectLimits')
    };
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="kbc-main-content">
          <SettingsTabs active="settings-limits" />
          <div className="tab-content">
            <div className="tab-pane tab-pane-no-padding active">
              {this.state.sections.map((section) => {
                return React.createElement(LimitsSection, {
                  section: section,
                  keenClient: this.state.client,
                  isKeenReady: this.state.isKeenReady,
                  canEdit: this.state.canEdit
                });
              }, this)}
            </div>
          </div>
        </div>
      </div>
    );
  },

  keenReady() {
    this.setState({
      isKeenReady: true
    });
  }

});
