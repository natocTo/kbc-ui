import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes: {
    flags: PropTypes.any.isRequired
  },

  render() {
    return (
      <div className="badge-component-container">
        <div className="badge badge-component-item">AAA</div>
        <div className="badge badge-component-item">VVV</div>
      </div>
    );
  }

});
