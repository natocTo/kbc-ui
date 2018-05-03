import React, {PropTypes} from 'react';
import ComponentBadge from './ComponentBadge';


export default React.createClass({
  propTypes: {
    flags: PropTypes.object.isRequired
  },

  render() {
    const badges = this.props.flags.map((flag) =>
      <ComponentBadge flag={flag}/>
    );
    return (
      <div className="badge-component-container">
        {badges}
      </div>
    );
  }
});
