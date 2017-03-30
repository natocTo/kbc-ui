import React, {PropTypes} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    tooltip: PropTypes.any.isRequired,
    id: PropTypes.string,
    children: PropTypes.any,
    placement: PropTypes.string
  },

  getDefaultProps() {
    return {
      placement: 'right'
    };
  },

  render() {
    return (
        <OverlayTrigger placement={this.props.placement} overlay={<Tooltip id={this.props.id}>{this.props.tooltip}</Tooltip>}>
          {this.props.children}
        </OverlayTrigger>
    );
  }
});
