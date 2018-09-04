import React from 'react';
import ClipboardButton from 'react-clipboard.js';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    label: React.PropTypes.string
  },

  getInitialState() {
    return {
      isCopied: false,
      isError: false
    };
  },

  render() {
    if (this.props.text && this.props.text !== '') {
      return (
        <OverlayTrigger overlay={this.tooltip()} ref="overlay">
          <span>
            <ClipboardButton style={{cursor: 'pointer'}} component="span" data-clipboard-text={this.props.text}
                             onError={this.handleError} onSuccess={this.handleAfterCopy}>
              <span className="fa fa-fw fa-copy"/> {this.props.label}
            </ClipboardButton>
          </span>
        </OverlayTrigger>
      );
    } else {
      return (
        <OverlayTrigger overlay={this.tooltip()} ref="overlay">
          <span>
            <span className="fa fa-fw fa-copy"/> {this.props.label}
          </span>
        </OverlayTrigger>
      );
    }
  },

  tooltip() {
    return (
      <Tooltip id="clipboardtooltip">{this.state.isError ? this.errorTooltip() : this.okTooltip()}</Tooltip>
    );
  },

  okTooltip() {
    if (this.props.text && this.props.text !== '') {
      return this.state.isCopied ? 'Copied!' : 'Copy to clipboard';
    }
    return 'Nothing to copy';
  },

  handleAfterCopy() {
    this.setState({
      isCopied: true
    });
    this.refs.overlay.show();
    /* global setTimeout */
    setTimeout(this.hideOverlay, 300);
  },

  handleError() {
    this.setState({
      isCopied: false,
      isError: true
    });
    this.refs.overlay.show();
    /* global setTimeout */
    setTimeout(this.hideOverlay, 2000);
  },

  errorTooltip() {
    let actionMsg = '';

    /* global navigatior */
    if (/iPhone|iPad/i.test(navigator.userAgent)) {
      actionMsg = 'No support :(';
    } else if (/Mac/i.test(navigator.userAgent)) {
      actionMsg = 'Press ⌘-C to copy';
    } else {
      actionMsg = 'Press Ctrl-C to copy';
    }

    return actionMsg;
  },

  hideOverlay() {
    this.refs.overlay.hide();
    this.setState({
      isCopied: false,
      isError: false
    });
  }

});
