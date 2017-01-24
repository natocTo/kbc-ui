import React, {PropTypes} from 'react/addons';
import ConfigurationLink from '../components/ComponentConfigurationLink';
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
      <ConfigurationLink
        componentId={this.props.componentId}
        configId={this.props.config.get('id')}
        className="tr"
      >
        <span className="td">
          <strong className="kbc-config-name">
            {this.props.config.get('name', '---')}
          </strong>
          {this.description()}
        </span>
        <span className="td text-right kbc-component-buttons">
          <span className="kbc-component-author">
            Created by <strong>{this.props.config.getIn(['creatorToken', 'description'])}</strong>
          </span>
          <RestoreConfigurationButton
            tooltip="Restore Configuration"
            isPending={this.props.isRestoring}
            confirm={this.restoreConfirmProps()}
          />
          <DeleteButton
            tooltip="Delete Configuration"
            isPending={this.props.isDeleting}
            confirm={this.deleteConfirmProps()}
          />
        </span>
      </ConfigurationLink>
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
      title: 'Delete Configuration',
      text: `Do you really want to permanently delete configuration ${this.props.config.get('name')}?`,
      onConfirm: this.handleDelete
    };
  },

  restoreConfirmProps() {
    return {
      title: 'Restore Configuration',
      text: `Do you really want to restore configuration ${this.props.config.get('name')}?`,
      onConfirm: this.handleRestore
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
