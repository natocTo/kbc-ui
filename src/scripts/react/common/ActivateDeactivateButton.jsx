import React from 'react';
import {Check, Loader} from '@keboola/indigo-ui';
import Tooltip from './Tooltip';

const MODE_BUTTON = 'button', MODE_LINK = 'link';

export default React.createClass({
  propTypes: {
    activateTooltip: React.PropTypes.string,
    deactivateTooltip: React.PropTypes.string,
    isActive: React.PropTypes.bool.isRequired,
    isPending: React.PropTypes.bool,
    buttonDisabled: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    mode: React.PropTypes.oneOf([MODE_BUTTON, MODE_LINK]),
    tooltipPlacement: React.PropTypes.string,
    buttonStyle: React.PropTypes.object,
    activateLabel: React.PropTypes.string,
    deactivateLabel: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      buttonDisabled: false,
      isPending: false,
      mode: MODE_BUTTON,
      tooltipPlacement: 'top',
      buttonStyle: {},
      activateTooltip: 'Enable',
      deactivateTooltip: 'Disable'
    };
  },

  render() {
    if (this.props.mode === MODE_BUTTON) {
      return this.renderButton();
    } else {
      return this.renderLink();
    }
  },

  tooltip() {
    return this.props.isActive ? this.props.deactivateTooltip : this.props.activateTooltip;
  },

  renderButton() {
    if (this.props.isPending) {
      return (
        <span className="btn btn-link" style={this.props.buttonStyle}>
          <Loader className="fa-fw"/>
        </span>
      );
    } else {
      return (
        <Tooltip placement={this.props.tooltipPlacement} tooltip={this.tooltip()}>
          <button disabled={this.props.buttonDisabled || this.props.isPending}
            style={this.props.buttonStyle} className="btn btn-link" onClick={this.handleClick}>
            {this.renderIcon()}
          </button>
        </Tooltip>
      );
    }
  },

  renderLink() {
    return (
      <a onClick={this.handleClick} disabled={this.props.isPending || this.props.buttonDisabled}
         className="btn btn-link"
      >
        {this.props.isPending ? <Loader className="fa-fw"/> : this.renderIcon(!this.props.isActive)} {this.tooltip()}
      </a>
    );
  },

  renderIcon() {
    return (
      <Check isChecked={this.props.isActive}/>
    );
  },

  renderLabel() {
    if (this.props.isActive) {
      if (this.props.deactivateLabel) {
        return ' ' + this.props.deactivateLabel;
      }
    }
    if (this.props.activateLabel) {
      return ' ' + this.props.deactivateLabel;
    }
    return null;
  },

  handleClick(e) {
    if (this.props.isPending || this.props.buttonDisabled) {
      return;
    }
    this.props.onChange(!this.props.isActive);
    e.stopPropagation();
    e.preventDefault();
  }
});
