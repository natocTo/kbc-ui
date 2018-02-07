import React from 'react';

import Tooltip from '../../../../react/common/Tooltip';
import { Loader } from '@keboola/indigo-ui';

export default React.createClass({
  displayName: 'ChangeOrderHandle',
  propTypes: {
    isPending: React.PropTypes.bool.isRequired,
    isPendingLabel: React.PropTypes.string,
    label: React.PropTypes.string,
    disabled: React.PropTypes.bool.isRequired,
    disabledLabel: React.PropTypes.string,
    tooltipPlacement: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      tooltipPlacement: 'top',
      label: 'Drag to change order',
      disabledLabel: 'Clear search query to allow changing order',
      isPendingLabel: 'Ordering in progress'
    };
  },

  tooltipLabel() {
    if (this.props.disabled) {
      return this.props.disabledLabel;
    }
    if (this.props.isPending) {
      return this.props.isPendingLabel;
    }
    return this.props.label;
  },

  render() {
    return (
      <Tooltip placement={this.props.tooltipPlacement} tooltip={this.tooltipLabel()}>
        {this.renderIcon()}
      </Tooltip>
    );
  },

  renderIcon() {
    if (this.props.isPending) {
      return (<Loader className="fa-fw" style={{cursor: 'not-allowed'}}/>);
    }
    if (this.props.disabled) {
      return (<span className="fa fa-bars fa-fw" style={{cursor: 'not-allowed', opacity: 0.65}}/>);
    }
    return ((<span className="fa fa-bars fa-fw drag-handle" style={{cursor: 'move'}}/>));
  }
});

