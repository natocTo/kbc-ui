import React, {PropTypes} from 'react';
import { Icon } from '@keboola/indigo-ui';
import { ExternalLink } from '@keboola/indigo-ui';
import ComponentType from './ComponentType';


require('./Badges.less');

export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired
  },

  render() {
    const badges = this.getBadges();

    return (
      <div className="badge-component-container-block">
        {badges.map((badge, idx) =>
          <div className="badge-component-row" key={idx}>
            <div className="badge-component-cell badge-component-placeholder">
                <div className={'badge badge-component-item badge-component-item-' + badge.key}>
                {badge.title}
                </div>
              </div>
              <div className="badge-component-cell badge-component-description">
                {badge.description}
              </div>
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
    if (flags.contains('excludeFromNewList')) {
      badges.push({
        title: 'Alpha',
        description: `This ${componentType} is private.`,
        key: 'excludeFromNewList'
      });
    }
    if (flags.contains('appInfo.dataIn')) {
      badges.push({
        title: <span><i className="fa fa-cloud-download fa-fw"/> IN</span>,
        description: `This ${componentType} retrieves data from outside sources.`,
        key: 'dataIn'
      });
    }
    if (flags.contains('appInfo.dataOut')) {
      badges.push({
        title: <span><i className="fa fa-cloud-upload fa-fw"/> OUT</span>,
        description: `This ${componentType} sends data outside of Keboola Connection.`,
        key: 'dataOut'
      });
    }
    if (flags.contains('appInfo.beta')) {
      badges.push({
        title: 'Beta',
        description: `The ${componentType} is public, but it's in beta stage.`,
        key: 'appInfo.beta'
      });
    }
    if (flags.contains('appInfo.fee')) {
      badges.push({
        title: <span><i className="fa fa-dollar fa-fw"/></span>,
        description: `There is an extra charge to use this ${componentType}.`,
        key: 'fee'
      });
    }
    if (flags.contains('appInfo.redshiftOnly')) {
      badges.push({
        title: <span><i className="fa fa-database fa-fw"/></span>,
        description: `A Redshift backend is required to use this ${componentType}.`,
        key: 'redshift'
      });
    }
    if (flags.contains('appInfo.fullAccess')) {
      badges.push({
        title: <span><i className="fa fa-key fa-fw"/></span>,
        description: `This ${componentType} will have full access to the project including all its data.`,
        key: 'fullAccess'
      });
    }
    if (flags.contains('deprecated')) {
      badges.push({
        title: <span><i className="fa fa-exclamation-triangle fa-fw"/><i className="fa fa-clock-o fa-fw"/></span>,
        description: `This ${componentType} is deprecated.`,
        key: 'deprecated'
      });
    }
    if (flags.contains('hasLicence')) {
      badges.push({
        title: <span><i className="fa fa-file-text-o fa-fw"/></span>,
        description: <span>You agree to the <ExternalLink href={this.props.component.getIn(['data', 'vendor', 'licenseUrl'])}>vendor's license agreement</ExternalLink>.</span>,
        key: 'license'
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
