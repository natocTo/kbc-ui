import React, {PropTypes} from 'react';
import ComponentBadge from './ComponentBadge';


export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['title', 'inline']),
    filterQuery: PropTypes.string
  },

  getDefaultProps() {
    return ({
      type: 'title',
      filterQuery: ''
    });
  },

  filterFlags()  {
    const flags = this.props.component.get('flags');
    if (this.props.filterQuery !== '')  {
      return flags.filter((flag) => flag === this.props.filterQuery);
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
      <span>
        {badges}
      </span>
    );
  }
});
