import React from 'react';
import CurrentUser from './CurrentUser';
import { fromJS } from 'immutable';

const urlTemplates = fromJS({
  logout: '/admin/logout',
  maintainer: '/admin/maintainers/<%= maintainerId %>',
  changePassword: '/admin/change-password',
  manageApps: '/admin/manage-apps',
  syrupJobsMonitoring: '/admin/syrup-jobs-monitoring'
});

const user = fromJS({
  profileImageUrl: '/user.png',
  email: 'dev@keboola.com',
  name: 'dev user'
});

const maintainers = fromJS([
  {
    id: 1,
    name: 'First Maintainer'
  }
]);

describe('<CurrentUser />', function() {
  it('should render 40x40 icon, with email, no admin links, no maintainers, dropup false (no mode passed)', function() {
    shallowSnapshot(
      <CurrentUser
        user={user}
        maintainers={fromJS([])}
        urlTemplates={urlTemplates}
        canManageApps={false}
        dropup={true}
      />
    );
  });

  it('should render 20x20 icon, no email, no admin links, no maintainers, dropup true', function() {
    shallowSnapshot(
      <CurrentUser
        user={user}
        maintainers={fromJS([])}
        urlTemplates={urlTemplates}
        canManageApps={false}
        dropup={true}
        mode="single"
      />
    );
  });

  it('should render 20x20 icon, no email, no admin links, with 1 maintainer, dropup false', function() {
    shallowSnapshot(
      <CurrentUser
        user={user}
        maintainers={maintainers}
        urlTemplates={urlTemplates}
        canManageApps={false}
        dropup={false}
        mode="single"
      />
    );
  });

  it('should render 40x40 icon, with email, no admin links, no maintainers, dropup true', function() {
    shallowSnapshot(
      <CurrentUser
        user={user}
        maintainers={fromJS([])}
        urlTemplates={urlTemplates}
        canManageApps={false}
        dropup={true}
        mode="normal"
      />
    );
  });

  it('should render 40x40 icon, with email, with admin links, with 1 maintainer, dropup false', function() {
    shallowSnapshot(
      <CurrentUser
        user={user}
        maintainers={maintainers}
        urlTemplates={urlTemplates}
        canManageApps={true}
        dropup={false}
        mode="normal"
      />
    );
  });
});
