import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import componentsActions from '../../components/InstalledComponentsActionCreators';
import Immutable from 'immutable';

export default React.createClass({

  mixins: [
    createStoreMixin(InstalledComponentStore)
  ],

  getStateFromStores() {
    const currentProject = ApplicationStore.getCurrentProject();
    const legacy = InstalledComponentStore.getAll().map(function(component) {
      const configurations = component.get('configurations').filter(function(configuration) {
        return JSON.stringify(configuration.get('configuration', Immutable.Map()).toJS()).indexOf('KBC::') >= 0
          || JSON.stringify(configuration.get('rows', Immutable.Map()).toJS()).indexOf('KBC::') >= 0;
      });
      if (configurations.count() > 0) {
        return component.set('configurations', configurations);
      }
      return component.delete('configurations');
    }).filter(function(component) {
      return component.get('configurations', Immutable.Map()).count() > 0;
    });
    return {
      projectId: currentProject.get('id'),
      legacyEncryptedConfigurations: legacy
    };
  },

  componentDidMount() {
    componentsActions.loadComponentsForce().then(function() {
      const components = InstalledComponentStore.getAll();
      if (components.count() > 0) {
        components.forEach(function(component) {
          componentsActions.loadComponentConfigsData(component.get('id'));
        });
      }
    });
  },

  render() {
    const number = this.state.legacyEncryptedConfigurations.reduce(function(value, component) {
      return value + component.get('configurations').count();
    }, 0);
    return (
      <div className="kbc-overview-component">
        <div className="row kbc-header kbc-expiration kbc-deprecation">
          <div className="alert alert-warning">
            <h3>
              Legacy encrypted configuration data
            </h3>
            <p>
              This project contains {number} configurations with legacy encrypted values.
            </p>
            <p>
              <button className="btn btn-success">Migrate</button>
            </p>
            <p>
              Learn more about encryption migration <a href="http://status.keboola.com/" target="_blank">timeline and reasons (TODO)</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
});
