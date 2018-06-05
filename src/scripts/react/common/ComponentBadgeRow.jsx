import React, {PropTypes} from 'react';

import './Badges.less';

export default React.createClass({
  propTypes: {
    badges: PropTypes.array.isRequired
  },

  render() {
    return (
      <div className="badge-component-container">
        {this.props.badges.map((badge) =>
          <div
            className={'badge badge-component-item badge-component-item-title badge-component-item-' + badge.key}
            title={badge.descriptionPlain}
            key={badge.key}
          >
            {badge.title}
          </div>
        )}
      </div>
    );
  }
});
