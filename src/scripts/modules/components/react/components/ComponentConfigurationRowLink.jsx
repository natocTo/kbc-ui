import React from 'react';
import {Link} from 'react-router';

module.exports = React.createClass({
  displayName: 'ComponentConfigurationRowLink',
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    rowId: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    query: React.PropTypes.object,
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func
  },

  render: function() {
    if (this.props.componentId === 'transformation') {
      return (<Link
        className={this.props.className}
        to="transformationDetail"
        params={{
          config: this.props.configId,
          row: this.props.rowId
        }}
        query={this.props.query}
        onClick={this.props.onClick}
        >{this.props.children}</Link>);
    }
    return (<Link
      className={this.props.className}
      to={this.props.componentId + '-row'}
      params={{
        config: this.props.configId,
        row: this.props.rowId
      }}
      query={this.props.query}
      onClick={this.props.onClick}
      >{this.props.children}</Link>);
  }
});
