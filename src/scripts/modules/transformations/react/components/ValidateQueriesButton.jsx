import React from 'react';

import {Button} from 'react-bootstrap';

// import SaveButtonsModal from './SaveButtonsModal';

export default React.createClass({

  propTypes: {
    transformationId: React.PropTypes.string.isRequired,
    bucketId: React.PropTypes.string.isRequired,
    backend: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      modalOpen: false
    };
  },

  render() {
    return (
      <div className="kbc-buttons">
        <Button
          bsStyle="link"
          disabled={this.props.disabled}
        >
          Validate
        </Button>
      </div>
    );
  }
});
