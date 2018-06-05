import React, {PropTypes} from 'react';

import './Badges.less';

export default React.createClass({
  propTypes: {
    badges: PropTypes.array.isRequired,
    badgesFilter: PropTypes.array
  },

  getDefaultProps() {
    return {
      badgesFilter: []
    };
  },

  render() {
    const badges = this.props.badgesFilter.length > 0
      ? this.props.badges.filter((badge) => this.props.badgesFilter.includes(badge.key))
      : this.props.badges;

    return (
      <div className="badge-component-container badge-component-container-selection">
        {badges.map((badge, idx) =>
          <div className={'badge badge-component-item badge-component-item-title badge-component-item-' + badge.key}
            title={badge.description}
            key={idx}
          >
            {badge.title}
          </div>
        )}
      </div>
    );
  }
});
