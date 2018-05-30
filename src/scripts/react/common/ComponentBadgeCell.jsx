import React, {PropTypes} from 'react';
import { Icon } from '@keboola/indigo-ui';
import ComponentType from './ComponentType';


require('./Badges.less');

export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired
  },

  render() {
    const badges = this.getBadges();

    return (
      <div className="badge-component-container-plain">
        {badges.map((badge, idx) =>
          <div className={'badge badge-component-item badge-component-item-' + badge.key}
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
    const flags = this.resolveFlags();
    const componentType = ComponentType.getComponentType(this.props.component.get('type'));
    let badges = [];

    if (!flags.contains('3rdParty')) {
      badges.push({
        title: <span><Icon.Keboola className="badge-component-item-responsibility-icon" /> Keboola</span>,
        description: `Support for this ${componentType} is provided by Keboola.`,
        key: 'responsibility'
      });
    }
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
  },

  resolveFlags() {
    if (this.props.component.getIn(['data', 'vendor', 'licenseUrl'])) {
      return this.props.component.get('flags').push('hasLicence');
    } else {
      return this.props.component.get('flags');
    }
  }
});
