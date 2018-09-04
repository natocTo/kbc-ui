import React from 'react';

import Tooltip from '../../../../react/common/Tooltip';
import {Loader} from '@keboola/indigo-ui';

const MODE_BUTTON = 'button', MODE_LINK = 'link';

export default React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    isPending: React.PropTypes.bool.isRequired,
    label: React.PropTypes.string,
    buttonDisabled: React.PropTypes.bool,
    mode: React.PropTypes.oneOf([MODE_BUTTON, MODE_LINK]),
    tooltipPlacement: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      buttonDisabled: false,
      mode: MODE_BUTTON,
      tooltipPlacement: 'top',
      label: 'Delete'
    };
  },

  render() {
    if (this.props.mode === MODE_BUTTON) {
      return this.renderButton();
    } else {
      return this.renderLink();
    }
  },

  onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.onClick();
  },

  renderButton() {
    return (
      <Tooltip placement={this.props.tooltipPlacement} tooltip={this.props.label}>
        <button disabled={this.props.buttonDisabled || this.props.isPending}
          className="btn btn-link" onClick={this.onClick}>
          {this.renderIcon()}
        </button>
      </Tooltip>
    );
  },

  renderIcon() {
    if (this.props.isPending) {
      return (
        <Loader className="fa-fw"/>
      );
    } else {
      return (
        <i className="kbc-icon-cup fa fa-fw"/>
      );
    }
  },

  renderLink() {
    return (
      <a onClick={this.onClick}>
        {this.renderIcon()}
        {' '}
        {this.props.label}
      </a>
    );
  }
});

