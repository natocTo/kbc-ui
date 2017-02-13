import React, {PropTypes} from 'react/addons';
import DeleteButton from '../../../../react/common/DeleteButton';
import RestoreConfigurationButton from '../../../../react/common/RestoreConfigurationButton';
import InstalledComponentsActionCreators from '../../../components/InstalledComponentsActionCreators';
import descriptionExcerpt from '../../../../utils/descriptionExcerpt';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

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
            Removed by <strong>{this.props.config.getIn(['currentVersion', 'creatorToken', 'description'])}</strong>
          </span>
          {this.buttons()}
        </span>
      </span>
    );
  },

  buttons() {
    if (this.props.componentId === 'gooddata-writer' || this.props.componentId === 'orchestrator') {
      return (
        <span>
         <OverlayTrigger overlay={<Tooltip placement="top">
           Configuration restore is not supported by component</Tooltip>}>
           <span className="btn btn-link"><i className="fa fa-exclamation-triangle"/></span>
          </OverlayTrigger>
          <DeleteButton
            tooltip="Delete Forever"
            icon="fa-times"
            isPending={this.props.isDeleting}
            confirm={this.deleteConfirmProps()}
          />
        </span>
      );
    } else {
      return (
        <span>
          <RestoreConfigurationButton
            tooltip="Restore"
            isPending={this.props.isRestoring}
            onRestore={this.handleRestore}
          />
          <DeleteButton
            tooltip="Delete Forever"
            icon="fa-times"
            isPending={this.props.isDeleting}
            confirm={this.deleteConfirmProps()}
          />
        </span>
      );
    }
  },

  description() {
    if (!this.props.config.get('description')) {
      return null;
    }
    return (
      <div><small>{descriptionExcerpt(this.props.config.get('description'))}</small></div>
    );
  },

  confirmMessage() {
    return (
      <span>Are you sure you want to permanently delete the configuration {this.props.config.get('name')}?
        <br/>
        <br/><em>You can't undo this action.</em>
      </span>
    );
  },

  deleteConfirmProps() {
    return {
      title: 'Delete Forever',
      text: this.confirmMessage(),
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
