import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import stringUtils from '../../utils/string';
const {webalize} = stringUtils;


export default React.createClass({
  propTypes: {
    flag: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['title', 'inline']),
    component: PropTypes.object.isRequired
  },

  render() {
    const content = this.getBadgeContent();

    if (content === null) {
      return null;
    } else {
      return (
        <div>
          <div className={'badge-component-wrap-' + this.props.type}>
            <div className={'badge badge-component-item badge-component-item-' + webalize(this.props.flag)}
              title={this.props.type === 'title' ? content.get('description') : ''}
            >
              {content.get('badge')}
            </div>
          </div>
          {this.props.type === 'inline' &&
          <div className="badge-component-description">
              {content.get('description')}
          </div>
          }
        </div>
      );
    }
  },

  getBadgeContent() {
    const flag = this.props.flag;
    let badge;
    let description;

    if (flag  === '3rdParty') {
      badge = <span>3<sup>rd</sup> party</span>;
      description = `This is a 3rd party ${this.getAppType()} supported by its author`;
    } else if (flag  === 'excludeFromNewList') {
      badge = 'Alpha';
      description = `This ${this.getAppType()} is private`;
    } else if (flag === 'appInfo.dataIn') {
      badge = <span><i className="fa fa-cloud-download fa-fw"/> IN</span>;
      description = `This ${this.getAppType()} extracts data from outside sources`;
    } else if (flag === 'appInfo.dataOut') {
      badge = <span><i className="fa fa-cloud-upload fa-fw"/> OUT</span>;
      description = `This ${this.getAppType()} sends data outside of Keboola Connection`;
    } else if (flag === 'responsibility') {
      badge = 'Keboola';
      description = `Support for this ${this.getAppType()} is provided by Keboola`;
    } else if (flag === 'appInfo.fee') {
      badge = <span><i className="fa fa-dollar fa-fw"/></span>;
      description = `There is an extra charge to use this ${this.getAppType()}`;
    } else if (flag === 'appInfo.redshiftOnly') {
      badge = <span><i className="fa fa-database fa-fw"/></span>;
      description = `Redshift backend is required to use this ${this.getAppType()}`;
    } else if (flag === 'appInfo.fullAccess') {
      badge = <span><i className="fa fa-key fa-fw"/></span>;
      description = `This ${this.getAppType()} will have full access to the project including all its data.`;
    } else if (flag === 'deprecated') {
      badge = <span><i className="fa fa-exclamation-triangle fa-fw"/><i className="fa fa-clock-o fa-fw"/></span>;
      description = `This ${this.getAppType()} is deprecated`;
    } else if (this.props.component.getIn(['vendor', 'licenseUrl'])) {
      badge = <span><i className="fa fa-file-text-o fa-fw"/></span>;
      description = <span>You agree to <a href={this.props.component.getIn(['vendor', 'licenseUrl'])}>vendor's license agreement</a></span>;
    } else {
      return null;
    }
    return Map({
      badge: badge,
      description: description
    });
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
        'component';
    }
  }
});
