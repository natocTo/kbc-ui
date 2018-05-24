import React, {PropTypes} from 'react';
import keboolaLogo from '../../../images/keboola.svg';
import { ExternalLink } from '@keboola/indigo-ui';


export default React.createClass({
  propTypes: {
    type: PropTypes.oneOf(['plain', 'description']),
    component: PropTypes.object.isRequired,
    filterBadges: PropTypes.array
  },

  getDefaultProps() {
    return ({
      type: 'plain',
      filterBadges: []
    });
  },

  render() {
    const badges = this.getBadges();

    return (
      <div className={'badge-component-container-' + this.props.type}>
        {badges.map((badge, idx) =>
          <div className="badge-component-row" key={idx}>
            <div className="badge-component-placeholder">
                <div className={'badge badge-component-item badge-component-item-' + badge.key}
                  title={this.props.type === 'title' ? badge.description : ''}
                >
                {badge.title}
                </div>
              </div>
            {this.props.type === 'description' &&
              <div className="badge-component-description">
                {badge.description}
              </div>
            }
          </div>
        )}
      </div>
    );
  },

  getBadges() {
    const flags = this.getFilterFlags();
    let badges = [];

    if (!flags.contains('3rdParty')) {
      badges.push({
        title: <span><img src={keboolaLogo} height="17" alt=""/> Keboola</span>,
        description: `Support for this ${this.getAppType()} is provided by Keboola.`,
        key: 'responsibility'
      });
    }
    if (flags.contains('3rdParty')) {
      badges.push({
        title: <span>3<sup>rd</sup> party</span>,
        description: `This is a third-party ${this.getAppType()} supported by its vendor.`,
        key: '3rdParty'
      });
    }
    if (flags.contains('excludeFromNewList')) {
      badges.push({
        title: 'Alpha',
        description: `This ${this.getAppType()} is private.`,
        key: 'excludeFromNewList'
      });
    }
    if (flags.contains('appInfo.dataIn')) {
      badges.push({
        title: <span><i className="fa fa-cloud-download fa-fw"/> IN</span>,
        description: `This ${this.getAppType()} retrieves data from outside sources.`,
        key: 'dataIn'
      });
    }
    if (flags.contains('appInfo.dataOut')) {
      badges.push({
        title: <span><i className="fa fa-cloud-upload fa-fw"/> OUT</span>,
        description: `This ${this.getAppType()} sends data outside of Keboola Connection.`,
        key: 'dataOut'
      });
    }
    if (flags.contains('appInfo.beta')) {
      badges.push({
        title: 'Beta',
        description: `The ${this.getAppType()} is public, but it's in beta stage.`,
        key: 'appInfo.beta'
      });
    }
    if (flags.contains('appInfo.fee')) {
      badges.push({
        title: <span><i className="fa fa-dollar fa-fw"/></span>,
        description: `There is an extra charge to use this ${this.getAppType()}.`,
        key: 'fee'
      });
    }
    if (flags.contains('appInfo.redshiftOnly')) {
      badges.push({
        title: <span><i className="fa fa-database fa-fw"/></span>,
        description: `A Redshift backend is required to use this ${this.getAppType()}.`,
        key: 'redshift'
      });
    }
    if (flags.contains('appInfo.fullAccess')) {
      badges.push({
        title: <span><i className="fa fa-key fa-fw"/></span>,
        description: `This ${this.getAppType()} will have full access to the project including all its data.`,
        key: 'fullAccess'
      });
    }
    if (flags.contains('deprecated')) {
      badges.push({
        title: <span><i className="fa fa-exclamation-triangle fa-fw"/><i className="fa fa-clock-o fa-fw"/></span>,
        description: `This ${this.getAppType()} is deprecated.`,
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


  getFilterFlags()  {
    let flags = this.resolveFlags();
    if (this.props.filterBadges.length !== 0)  {
      return flags.filter((flag) => {
        return this.props.filterBadges.indexOf(flag) !== -1;
      });
    }
    return flags;
  },

  getAppType() {
    switch (this.props.component.get('type')) {
      case 'extractor':
        return 'extractor';
      case  'writer':
        return 'writer';
      case 'application':
        return 'application';
      default:
        return 'component';
    }
  },

  resolveFlags() {
    if (this.props.component.getIn(['data', 'vendor', 'licenseUrl'])) {
      return this.props.component.get('flags').push('hasLicence');
    } else {
      return this.props.component.get('flags');
    }
  }
});
