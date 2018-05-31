import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import componentsActions from '../../components/InstalledComponentsActionCreators';
import Immutable from 'immutable';
import { AlertBlock } from '@keboola/indigo-ui';
import Modal from './EncryptionMigrationModal';
export default React.createClass({

  mixins: [
    createStoreMixin(InstalledComponentStore)
  ],

  getStateFromStores() {
    const currentProject = ApplicationStore.getCurrentProject();
    const legacy = InstalledComponentStore.getAll().map(function(component) {
      const configurations = component.get('configurations').filter(function(configuration) {
        return JSON.stringify(configuration.get('configuration', Immutable.Map()).toJS()).indexOf('KBC::Encrypted') >= 0
          || JSON.stringify(configuration.get('rows', Immutable.Map()).toJS()).indexOf('KBC::Encrypted') >= 0;
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

  getInitialState() {
    return {
      isModalOpen: false
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

  showModal() {
    this.setState({isModalOpen: true});
  },

  hideModal() {
    this.setState({isModalOpen: false});
  },


  renderMigrateButton() {
    let label = 'Migrate encryption';
    if (this.state.processing) {
      label = 'Migrating';
    }
    if (this.state.finished) {
      label = 'Migrated';
    }
    return (
      <button
        className="btn btn-success"
        onClick={this.showModal}
        disabled={this.state.processing || this.state.finished}
      >{label}</button>
    );
  },

  render() {
    const number = this.state.legacyEncryptedConfigurations.reduce(function(value, component) {
      return value + component.get('configurations').count();
    }, 0);
    return (
      <AlertBlock type="warning" title="Legacy encrypted configuration data">
        <Modal
          onHide={this.hideModal}
          show={this.state.isModalOpen}
          configurations={this.state.legacyEncryptedConfigurations}
        />
        <p>
          This project contains {number} configurations with legacy encrypted values.
        </p>
        <p>
          {this.renderMigrateButton()}
        </p>
        <p>
          Learn more about encryption migration <a href="http://status.keboola.com/" target="_blank">timeline and reasons (TODO)</a>.
        </p>
      </AlertBlock>
    );
  }
});
