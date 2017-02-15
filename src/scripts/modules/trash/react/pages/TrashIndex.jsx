import React from 'react';
import {Map} from 'immutable';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ComponentsStore from '../../../components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import InstaledComponentsActions from '../../../components/InstalledComponentsActionCreators';

import SplashIcon from '../../../../react/common/SplashIcon';
import SearchRow from '../../../../react/common/SearchRow';
import DeletedComponentRow from '../components/DeletedComponentRow';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ComponentsStore)],

  getStateFromStores() {
    const components = ComponentsStore.getAll().filter(function(component) {
      if (component.get('flags').includes('excludeFromNewList')) {
        return false;
      }

      return true;
    });

    return {
      filter: InstalledComponentsStore.getTrashFilter(),
      installedComponents: InstalledComponentsStore.getAllDeleted(),
      installedFilteredComponents: InstalledComponentsStore.getAllDeletedFiltered(),
      deletingConfigurations: InstalledComponentsStore.getDeletingConfigurations(),
      restoringConfigurations: InstalledComponentsStore.getRestoringConfigurations(),
      components: components
    };
  },

  handleFilterChange(query) {
    InstaledComponentsActions.deletedConfigurationsFilterChange(query);
  },

  render() {
    if (this.state.installedComponents.count()) {
      let components = this.state.installedFilteredComponents;
      const rows = components.map(function(component) {
        return (
          <DeletedComponentRow
            component={component}
            deletingConfigurations={this.state.deletingConfigurations.get(component.get('id'), Map())}
            restoringConfigurations={this.state.restoringConfigurations.get(component.get('id'), Map())}
            key={component.get('id')}
          />
        );
      }, this).toArray();

      return (
        <div className="container-fluid kbc-main-content kbc-components-list">
          <div className="row">
            <h2>Configuration trash</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          </div>
          <SearchRow
            className="row kbc-search-row"
            query={this.state.filter}
            onChange={this.handleFilterChange}
          />
          {rows}
        </div>
      );
    } else {
      return (
        <SplashIcon icon="kbc-icon-cup" label="Trash is empty"/>
      );
    }
  }
});
