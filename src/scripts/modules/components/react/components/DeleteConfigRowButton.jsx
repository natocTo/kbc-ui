import React from 'react';

import Tooltip from '../../../../react/common/Tooltip';
import {Loader} from 'kbc-react-components';

const MODE_BUTTON = 'button', MODE_LINK = 'link';

export default React.createClass({
  displayName: 'DeleteConfigRowButton',
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
      label: 'Delete Row'
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
    if (this.props.isPending) {
      return (
        <span className="btn btn-link">
           <Loader className="fa-fw"/>
         </span>
      );
    } else {
      return (
        <Tooltip placement={this.props.tooltipPlacement} tooltip={this.props.label}>
          <button disabled={this.props.buttonDisabled}
                  className="btn btn-link" onClick={this.onClick}>
            <i className="kbc-icon-cup"/>
          </button>
        </Tooltip>
      );
    }
  },

  renderLink() {
    // TODO
    return;
  }
});

