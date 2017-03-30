import React, {PropTypes} from 'react';
import CreateSandboxModal from '../modals/ConfigureSandbox';
import Tooltip from './../../../../react/common/Tooltip';

export default React.createClass({
  propTypes: {
    backend: PropTypes.string.isRequired,
    runParams: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['link', 'button'])
  },

  getDefaultProps() {
    return {
      mode: 'link'
    };
  },

  getInitialState() {
    return {
      isModalOpen: false
    };
  },

  openModal(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      isModalOpen: true
    });
  },

  render() {
    if (this.props.mode === 'button') {
      return (
        <Tooltip placement="top" tooltip="Create sandbox">
          <button className="btn btn-link" onClick={this.openModal}>
            <i className="fa fa-fw fa-wrench"/>
            {this.renderModal()}
          </button>
        </Tooltip>
      );
    } else {
      return (
        <a onClick={this.openModal}>
          <i className="fa fa-fw fa-wrench"/> Create sandbox
          {this.renderModal()}
        </a>
      );
    }
  },

  renderModal() {
    return React.createElement(CreateSandboxModal, {
      show: this.state.isModalOpen,
      onHide: () => {
        this.setState({
          isModalOpen: false
        });
      },
      defaultMode: 'prepare',
      backend: this.props.backend,
      runParams: this.props.runParams
    });
  }
});
