/*
   Splash icon
 */
import React from 'react';

export default React.createClass({

  propTypes: {
    label: React.PropTypes.string,
    icon: React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      label: ''
    };
  },

  _splashTitle() {
    if (this.props.label && this.props.label.length > 0) {
      return (
        <h1>{this.props.label}</h1>
      );
    }

    return null;
  },

  _splashIcon() {
    return (
      <i className={'fa ' + this.props.icon} style={{fontSize: '250px'}} />
    );
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="kbc-main-loader text-muted" style={{marginTop: '10vh'}}>
          {this._splashTitle()}
          {this._splashIcon()}
        </div>
      </div>
    );
  }
});
