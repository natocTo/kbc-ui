import React, {PropTypes} from 'react';
import getComponentType from './componentType';

require('./Badges.less');

export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired
  },

  render() {
    const badges = this.getBadges();

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
  },
  getBadges() {
    const flags = this.props.component.get('flags');
    const componentType = getComponentType(this.props.component.get('type'));
    let badges = [];
    if (flags.contains('3rdParty')) {
      badges.push({
        title: <span>3<sup>rd</sup> party</span>,
        description: `This is a third-party ${componentType} supported by its vendor.`,
        key: '3rdParty'
      });
    }
    if (flags.contains('appInfo.beta')) {
      badges.push({
        title: 'Beta',
        description: `The ${componentType} is public, but it's in beta stage.`,
        key: 'appInfo.beta'
      });
    }
    return badges;
  }
});
