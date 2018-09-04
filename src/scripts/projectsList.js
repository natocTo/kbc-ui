import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import CurrentUser from './react/layout/CurrentUser';
import ProjectsList from './react/layout/project-select/List';

const App = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    urlTemplates: PropTypes.object.isRequired,
    projectTemplates: PropTypes.object.isRequired,
    organizations: PropTypes.object.isRequired,
    maintainers: PropTypes.object.isRequired,
    canCreateProject: PropTypes.bool.isRequired
  },
  render() {
    return (
      <div className="kbc-outer-container">
        <div className="kbc-outer-logo">
          <span className="kbc-icon-keboola-logo" />
          <span className="kbc-notification">
            <a>
              <span className="kbc-notification-icon fa fa-bell">
                <span className="kbc-notification-icon-badge">
                  <span className="kbc-notification-icon-badge-inner" />
                </span>
              </span>
            </a>
          </span>
          <CurrentUser
            user={this.props.user}
            maintainers={this.props.maintainers}
            urlTemplates={this.props.urlTemplates}
            canManageApps={true}
            dropup={false}
          />
        </div>
        <div className="kbc-outer-content well">
          <ProjectsList
            organizations={this.props.organizations}
            urlTemplates={this.props.urlTemplates}
            projectTemplates={this.props.projectTemplates}
            focus={true}
            canCreateProject={this.props.canCreateProject}
          />
        </div>
      </div>
    );
  }
});

module.exports = {
  start: function(appOptions) {
    document.body.className = 'kbc-outer-page kbc-projects-list';
    return ReactDOM.render(
      React.createElement(App, {
        user: Immutable.fromJS(appOptions.data.kbc.admin),
        urlTemplates: Immutable.fromJS(appOptions.data.kbc.urlTemplates),
        projectTemplates: Immutable.fromJS(appOptions.data.projectTemplates),
        maintainers: Immutable.fromJS(appOptions.data.maintainers),
        organizations: Immutable.fromJS(appOptions.data.organizations),
        canCreateProject: appOptions.data.kbc.canCreateProject
      }),
      document.body
    );
  },
  helpers: require('./helpers')
};
