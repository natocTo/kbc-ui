import React from 'react';
import ConfirmModal from './ConfirmModal';

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    text: React.PropTypes.node.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    buttonLabel: React.PropTypes.string.isRequired,
    buttonType: React.PropTypes.string,
    children: React.PropTypes.any,
    childrenRootElement: React.PropTypes.any
  },

  getDefaultProps() {
    return {
      buttonType: 'danger',
      childrenRootElement: React.DOM.span
    };
  },

  getInitialState() {
    return {
      showModal: false
    };
  },

  closeModal() {
    this.setState({showModal: false});
  },

  onButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({showModal: true});
  },

  render() {
    const modal = <ConfirmModal show={this.state.showModal} onHide={this.closeModal} {...this.props} key="modal"/>;
    return this.props.childrenRootElement({onClick: this.onButtonClick, className: 'btn btn-link'}, [this.props.children, modal]);
  }

});
