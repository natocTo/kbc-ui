import React, {PropTypes} from 'react';
import ComponentBadge from './ComponentBadge';


export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['title', 'inline'])
  },

  getDefaultProps() {
    return ({
      type: 'title'
    });
  },

  render() {
    const badges = this.props.component.get('flags').map((flag) =>
      <ComponentBadge flag={flag} type={this.props.type} />
    );
    return (
      <div className="badge-component-container">
        {badges}
      </div>
    );
  }
});
