/*
  Delete button with confirm and loading state
*/

import React from 'react';
import classnames from 'classnames';
import Tooltip from './Tooltip';
import { Loader } from '@keboola/indigo-ui';
import Confirm from './Confirm';
import { isObsoleteComponent } from '../../modules/trash/utils';

export default React.createClass({
  propTypes: {
    tooltip: React.PropTypes.string,
    confirm: React.PropTypes.object, // Confirm props
    isPending: React.PropTypes.bool,
    isEnabled: React.PropTypes.bool,
    label: React.PropTypes.string,
    pendingLabel: React.PropTypes.string,
    fixedWidth: React.PropTypes.bool,
    icon: React.PropTypes.string,
    componentId: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      tooltip: 'Delete',
      isPending: false,
      isEnabled: true,
      label: '',
      pendingLabel: '',
      fixedWidth: false,
      icon: 'kbc-icon-cup'
    };
  },

  render() {
    if (this.props.isPending) {
      return (
        <span className="btn btn-link" disabled={true}>
          <Loader className="fa-fw" />
          {this.props.pendingLabel && ` ${this.props.pendingLabel}`}
        </span>
      );
    }

    if (!this.props.isEnabled) {
      return (
        <button className="btn btn-link disabled" disabled={true}>
          <i className={classnames('fa', this.props.icon, { 'fa-fw': this.props.fixedWidth })} />
          {this.props.label && ` ${this.props.label}`}
        </button>
      );
    }

    if (isObsoleteComponent(this.props.componentId)) {
      return (
        <Confirm buttonLabel="Delete" {...this.props.confirm}>
          <Tooltip tooltip={this.props.tooltip} id="delete" placement="top">
            <button className="btn btn-link">
              <i className={classnames('fa', this.props.icon, { 'fa-fw': this.props.fixedWidth })} />
              {this.props.label && ` ${this.props.label}`}
            </button>
          </Tooltip>
        </Confirm>
      );
    }

    return (
      <Confirm buttonLabel="Delete" {...this.props.confirm}>
        <button className="btn btn-link" onClick={this.props.confirm.onConfirm}>
          <i className={classnames('fa', this.props.icon, { 'fa-fw': this.props.fixedWidth })} />
          {this.props.label && ` ${this.props.label}`}
        </button>
      </Confirm>
    );
  }
});
