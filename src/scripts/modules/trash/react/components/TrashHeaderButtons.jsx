import React from 'react/addons';
import Confirm from '../../../../react/common/Confirm';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import InstaledComponentsActions from '../../../components/InstalledComponentsActionCreators';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore)],

  getStateFromStores() {
    return {
      filter: InstalledComponentsStore.getTrashFilter(),
      installedFilteredComponents: InstalledComponentsStore.getAllDeletedFiltered(),
      deletingConfigurations: InstalledComponentsStore.getDeletingConfigurations()
    };
  },


  render() {
    if (!this.state.installedFilteredComponents.count()) {
      return (
        <span></span>
      );
    } else {
      return (
        <Confirm
          title="Empty Trash"
          text={this.deleteConfirmMessage()}
          buttonLabel="Empty Trash"
          onConfirm={this.handleDelete}>
          <button className="btn btn-link">
            <i className="fa fa-times fa-fw"></i> Empty Trash
          </button>
        </Confirm>
      );
    }
  },

  deleteConfirmMessage() {
    if (this.state.filter && this.state.filter !== '') {
      return (
        <span>Are you sure you want to permanently delete all filtered configurations in Trash?
          <br/>
          <br/><em>You can't undo this action.</em>
        </span>
      );
    } else {
      return (
        <span>Are you sure you want to permanently delete all configurations in Trash?
          <br/>
          <br/><em>You can't undo this action.</em>
        </span>
      );
    }
  },

  handleDelete() {
    InstaledComponentsActions.deleteAllFilteredConfigurationsPermanently();
  }

});
