import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {Map} from 'immutable';


export default React.createClass({
  propTypes: {
    flag: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['title', 'inline'])
  },

  render() {
    const content = this.getBadgeContent();

    return (
      <div>
        <div className={classNames('badge badge-component-item badge-component-item-', this.props.flag)}
             title={this.props.type === 'title' ? content.get('description') : ''}
        >
        {content.get('badge')}
        </div>
        {this.props.type === 'inline' &&
        <div>
            {content.get('description')}
        </div>
        }
      </div>
    );
  },

  getBadgeContent() {
    let badge;
    let description;

    if (this.props.flag  === '3rdParty') {
      badge = <span>3<sup>rd</sup> party</span>;
      description = 'This is a 3rd party #{this.getAppType()} supported by its author';
    }
    if (this.props.flag  === 'excludeFromNewList') {
      badge = 'Alpha';
    }
    if (this.props.flag === 'appInfo.dataIn') {
      badge = <span><i className="fa fa-cloud-download fa-fw"/> IN</span>;
      description = 'This #{this.getAppType()} extracts data from outside sources';
    }
    if (this.props.flag === 'appInfo.dataOut') {
      badge = <span><i className="fa fa-cloud-upload fa-fw"/> OUT</span>;
      description = 'This #{this.getAppType()} sends data outside of Keboola Connection';
    }
    if (this.props.flag === 'responsibility') {
      badge = 'Keboola';
      description = 'Support for this #{this.getAppType()} is provided by Keboola';
    }
    if (this.props.flag === 'appInfo.fee') {
      badge = <span><i className="fa fa-dollar fa-fw"/></span>;
      description = 'There is an extra charge to use this ' + this.getAppType();
    }
    if (this.props.flag === 'appInfo.redshiftOnly') {
      badge = <span><i className="fa fa-database fa-fw"/></span>;
      description = 'Redshift backend is required to use this ' + this.getAppType();
    }
    if (this.props.flag === 'appInfo.fullAccess') {
      badge = <span><i className="fa fa-key fa-fw"/></span>;
      description = 'This ' + this.getAppType() + ' will have full access to the project including all its data.';
    }
    if (this.props.flag === 'deprecated') {
      badge = <span><i className="fa fa-exclamation-triangle fa-fw"/><i className="fa fa-clock-o fa-fw"/></span>;
    }
    if (this.props.flag === 'license') {
      badge = <span><i className="fa fa-file-text-o fa-fw"/></span>;
      // DUMMY
      description = 'lorem  lorem lorem';

    // if (this.props.component.getIn(['vendor', 'licenseUrl'])) {
    //   description = 'You agree to ';
    //   // a {href: this.props.component.getIn(['vendor', 'licenseUrl'])},
    //   //   'vendor\'s license agreement'
    // }
    }
    return Map({
      badge: badge,
      description: description
    });
  },

  getAppType() {
    return 'component';
    // switch (this.props.component.get('type')) {
    //   case 'extractor':
    //     return 'extractor';
    //   case  'writer':
    //     return 'writer';
    //   case 'application':
    //     return 'application';
    //   default:
    //     'component';
    // }
  }
});
