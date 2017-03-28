import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {OverlayTrigger, Popover} from './KbcBootstrap';

export default React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  },
  mixins: [PureRenderMixin],

  render() {
    return (
      <OverlayTrigger overlay={this.popover()}>
        <span className="fa fa-question-circle kbc-cursor-pointer"/>
      </OverlayTrigger>
    );
  },

  popover() {
    return (
      <Popover title={this.props.title}>
        {this.props.children}
      </Popover>
    );
  }
});
