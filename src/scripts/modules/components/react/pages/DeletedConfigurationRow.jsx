import React, {PropTypes} from 'react/addons';
import DeleteButton from '../../../../react/common/DeleteButton';
import RestoreConfigurationButton from '../components/RestoreConfigurationButton';
import InstalledComponentsActionCreators from '../../InstalledComponentsActionCreators';
import descriptionExcerpt from '../../../../utils/descriptionExcerpt';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    config: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    componentId: PropTypes.string.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    isRestoring: PropTypes.bool.isRequired
  },

  render() {
    return (
      <span className="tr">
        <span className="td">
          <strong className="kbc-config-name">
            {this.props.config.get('name', '---')}
          </strong>
          {this.description()}
        </span>
        <span className="td text-right kbc-component-buttons">
          <span className="kbc-component-author">
            Removed by <strong>{this.props.config.getIn(['creatorToken', 'description'])}</strong>
          </span>
          <RestoreConfigurationButton
            tooltip="Put Back"
            isPending={this.props.isRestoring}
            onRestore={this.handleRestore}
        />
          <DeleteButton
            tooltip="Delete Immediatelly"
            icon="fa-times"
            isPending={this.props.isDeleting}
            confirm={this.deleteConfirmProps()}
          />
        </span>
      </span>
    );
  },

  description() {
    if (!this.props.config.get('description')) {
      return null;
    }
    return (
      <div><small>{descriptionExcerpt(this.props.config.get('description'))}</small></div>
    );
  },

  deleteConfirmProps() {
    return {
      title: 'Delete Immediatelly',
      text: `Do you really want to Delete configuration ${this.props.config.get('name')}?`,
      onConfirm: this.handleDelete
    };
  },

  runParams() {
    return () => ({config: this.props.config.get('id')});
  },

  handleDelete() {
    InstalledComponentsActionCreators.deleteConfigurationPermanently(this.props.componentId, this.props.config.get('id'), false);
  },

  handleRestore() {
    InstalledComponentsActionCreators.restoreConfiguration(this.props.componentId, this.props.config.get('id'), false);
  }
});
