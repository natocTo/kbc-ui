import React, {PropTypes} from 'react';
import ComponentType from './ComponentType';


require('./Badges.less');

export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired
  },

  getDefaultProps() {
    return ({
      filterBadges: []
    });
  },

  render() {
    const badges = this.props.component.get('flags');

    return (
      <div className={'badge-component-container-plain'}>
        {badges.map((badge, idx) =>
          <div className="badge-component-row" key={idx}>
            <div className="badge-component-placeholder">
                <div className={'badge badge-component-item badge-component-item-' + badge.key}
                  title={badge.description}
                >
                {badge.title}
                </div>
              </div>
          </div>
        )}
      </div>
    );
  },

  getBadges() {
    const flags = this.getFilterFlags();
    const componentType = ComponentType.getComponentType(this.props.component.get('type'));
    let badges = [];
    if (flags.contains('3rdParty')) {
      badges.push({
        title: <span>3<sup>rd</sup> party</span>,
        description: `This is a third-party ${componentType} aaa supported by its vendor.`,
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
