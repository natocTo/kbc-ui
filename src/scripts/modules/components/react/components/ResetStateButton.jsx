import React from 'react';
import {Loader} from '@keboola/indigo-ui';
import Modal from './ResetStateButtonModal';

export default React.createClass({
  displayName: 'ResetStateButton',
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    isPending: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    label: React.PropTypes.string,
    children: React.PropTypes.node.isRequired
  },

  getDefaultProps() {
    return {
      label: 'Reset State'
    };
  },

  getInitialState: function() {
    return {
      showModal: false
    };
  },

  renderModal() {
    const component = this;
    return (
      <Modal
        onHide={function() {
          component.setState({showModal: false});
        }}
        show={this.state.showModal}
        title={this.props.label}
        body={this.props.children}
        onRequestRun={this.onClick}
        disabled={this.props.disabled}
      />
    );
  },

  render() {
    const component = this;
    return (
      <a onClick={function() {
        component.setState({showModal: true});
      }}>
        {this.renderModal()}
        {this.renderIcon()}
        {' '}
        {this.props.label}
      </a>
    );
  },

  onClick(e) {
    if (!this.props.disabled) {
      e.stopPropagation();
      e.preventDefault();
      this.props.onClick();
    }
  },

  renderIcon() {
    if (this.props.isPending) {
      return (
        <Loader className="fa-fw"/>
      );
    } else {
      return (
        <i className="fa fa-fw fa-fast-backward"/>
      );
    }
  }
});

