import React, { PropTypes } from 'react';
import _ from 'underscore';
import { DropdownButton, MenuItem } from 'react-bootstrap';

const modes = {
  NORMAL: 'normal',
  SINGLE_PAGE: 'single'
};

export default React.createClass({
  displayName: 'User',

  propTypes: {
    user: PropTypes.object.isRequired,
    maintainers: PropTypes.object.isRequired,
    urlTemplates: PropTypes.object.isRequired,
    canManageApps: PropTypes.bool.isRequired,
    dropup: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf([modes.NORMAL, modes.SINGLE_PAGE])
  },

  getDefaultProps() {
    return {
      mode: modes.NORMAL
    };
  },

  render() {
    return (
      <div className="kbc-user" onClick={this._handleUserClick}>
        <img
          src={this.props.user.get('profileImageUrl')}
          className="kbc-user-avatar"
          width={this._iconSize()}
          height={this._iconSize()}
        />
        <div>
          <strong>{ this.props.user.get('name') }</strong>
          <DropdownButton
            className="kbc-user-menu"
            bsStyle="link"
            dropup={this.props.dropup}
            title={<span className="kbc-icon-picker"/>}
            ref="dropdownButton"
            noCaret={true}
            id="react-layout-current-user-dropdown"
          >
            <MenuItem
              key="changePassword"
              href={this.props.urlTemplates.get('changePassword')}
            >Account Settings</MenuItem>
            { this._renderAdminItems() }
            { this._renderMaintainers() }
            <MenuItem
              key="logoutDivider"
              divider={true}
            />
            <MenuItem
              href={this.props.urlTemplates.get('logout')}
              key="logout"
            >Logout</MenuItem>
          </DropdownButton>
        </div>
        { this._userEmail() }
      </div>
    );
  },

  _userEmail() {
    if (this.props.mode === modes.NORMAL) {
      return (
        <div>
          <span>{ this.props.user.get('email') }</span>
        </div>
      );
    }
  },

  _iconSize() {
    return this.props.mode === modes.SINGLE_PAGE ? 20 : 40;
  },

  _renderMaintainers() {
    if (!this.props.maintainers.count()) {
      return;
    }

    let links = [];

    links.push(
      <MenuItem
        header={true}
        key="maintainersHeader"
      >Maintainers</MenuItem>
    );

    this.props.maintainers.forEach((maintainer) => {
      links.push(
        <MenuItem
          href={this._maintainerUrl(maintainer.get('id'))}
          key={'maintainer-' + maintainer.get('id')}
        >{ maintainer.get('name') }</MenuItem>
      );
    });

    return links;
  },

  _renderAdminItems() {
    if (!this.props.canManageApps) {
      return;
    }
    return [
      <MenuItem
        key="manageApps"
        href={this.props.urlTemplates.get('manageApps')}
      >Manage Applications</MenuItem>,
      <MenuItem
        key="syrupJobsMonitoring"
        href={this.props.urlTemplates.get('syrupJobsMonitoring')}
      >Syrup Jobs Monitoring</MenuItem>
    ];
  },

  _maintainerUrl(id) {
    return _.template(this.props.urlTemplates.get('maintainer'))({maintainerId: id});
  }

  /* _handleUserClick(e) {
   *   if (e.target.tagName !== 'A') {
   *     this.refs.dropdownButton.handleDropdownClick(e);
   *   }
   * }*/

});
