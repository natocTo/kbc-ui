import React, {PropTypes} from 'react';
import {fromJS} from 'immutable';
import ProfilesLoader from './ProfilesLoader';
import {Alert, Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import EmptyState from '../../components/react/components/ComponentEmptyState';

export default React.createClass({

  propTypes: {
    authorizedEmail: PropTypes.string,
    localStateProfiles: PropTypes.object.isRequired,
    localStatePickerData: PropTypes.object.isRequired,
    updateLocalStateProfiles: PropTypes.func.isRequired,
    updateLocalStatePickerData: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired

  },

  render() {
    return this.renderProfilesSelector();
  },

  renderProfilesSelector() {
    const gaData = this.props.localStatePickerData;
    const profiles = gaData.get('profiles');
    const email = gaData.get('email');
    return (
      <div className="text-center">
        <h3> 1. Load Google Account Profiles</h3>
        {this.renderProfilesPicker()}
        {profiles ?
         <span>
           <h3>2. Select Profiles of {email} </h3>
           {this.renderWarning(email)}
           {this.renderLoadedProfiles(profiles)}
         </span>
         :
         <EmptyState>
           No Profiles Loaded
         </EmptyState>
        }
      </div>
    );
  },


  renderWarning(profilesEmail) {
    const {authorizedEmail} = this.props;
    if (authorizedEmail && profilesEmail && profilesEmail !== authorizedEmail) {
      return (
        <Alert bsStyle="warning">
          <strong>Warning:</strong>
          Selected account {profilesEmail} does not match account authorized for data extraction <strong>{authorizedEmail}</strong>.
        </Alert>
      );
    } else {
      return null;
    }
  },

  renderLoadedProfiles(profiles) {
    return (
      <div className="kbc-accordion kbc-panel-heading-with-table kbc-panel-heading-with-table'">
        { profiles && profiles.count() > 0 ?
          profiles.map((p, pname) => this.renderProfileGroup(p, pname))
          :
          <EmptyState>The account has no profiles</EmptyState>
        }
      </div>
    );
  },


  renderProfileGroup(profileGroup, profileGroupName) {
    const header = (
      <span>
        {profileGroupName}
      </span>);

    return (
      <Panel
        header={header}
        key={profileGroupName}
        collapsible={true}
        className="profile-panel">
        {profileGroup.map((p, pname) => this.renderProfilePanel(p, pname))}
      </Panel>
    );
  },

  renderProfilePanel(profile, profileName) {
    const header = (
      <span>
        {profileName}
      </span>);
    return (
      <Panel
        header={header}
        key={profileName}
        eventKey={profileName}
        collapsible={true}>
        <div className="row">
          <ListGroup>
            {profile.map((pItem) =>
              <ListGroupItem
                active={this.isSelected(pItem)}
                onClick={() => this.onProfileClick(pItem)}>
                <div className="text-center">
                  {pItem.get('name')}
                </div>
              </ListGroupItem>).toArray()}
          </ListGroup>
        </div>
      </Panel>
    );
  },

  onProfileClick(profile) {
    const profiles = this.props.localStateProfiles;
    if (!this.isSelected(profile)) {
      this.props.updateLocalStateProfiles(profiles.push(profile));
    } else {
      this.deselectProfile(profile.get('id'));
    }
  },

  isSelected(profile) {
    const profiles = this.props.localStateProfiles;
    return profiles.find((p) => p.get('id').toString() === profile.get('id').toString());
  },

  deselectProfile(profileId) {
    const profiles = this.props.localStateProfiles;
    const newProfiles = profiles.filter((p) => p.get('id') !== profileId);
    this.props.updateLocalStateProfiles(newProfiles);
  },

  renderProfilesPicker() {
    return (
      <ProfilesLoader
        email={null}
        onProfilesLoadError={
          (err) => {
            this.props.sendNotification({
              message: err.message,
              type: 'error'
            });
          }}
        onProfilesLoad={
          (profiles, email) => {
            const pickerData = fromJS({
              profiles: profiles,
              email: email
            });
            this.props.updateLocalStatePickerData(pickerData);
            console.log('loaded profiles', profiles, email);
          }}
      />
    );
  }


});
