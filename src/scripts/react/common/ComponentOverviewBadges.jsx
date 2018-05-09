import React, {PropTypes} from 'react';
import ComponentBadge from './ComponentBadge';


export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['title', 'inline']),
    filter: PropTypes.string.isRequired
  },

  getDefaultProps() {
    return ({
      type: 'title',
      filter: ''
    });
  },

  filterFlags()  {
    const flags = this.props.component.get('flags');
    if (this.props.filter !== '')  {
      return flags.filter((flag) => flag === this.props.filter);
    } else {
      return flags;
    }
  },

  render() {
    const filteredFlags = this.filterFlags();
    const badges = filteredFlags.map((flag) =>
      <ComponentBadge flag={flag} component={this.props.component} type={this.props.type} />
    );
    return (
      <div className="badge-component-container">
        {badges}
      </div>
    );
  }
});
