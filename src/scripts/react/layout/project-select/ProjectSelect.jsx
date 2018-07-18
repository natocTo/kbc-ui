import React from 'react';

import ProjectsList from './List';

import { Icon } from '@keboola/indigo-ui';


export default React.createClass({

  propTypes: {
    organizations: React.PropTypes.object.isRequired,
    currentProject: React.PropTypes.object.isRequired,
    urlTemplates: React.PropTypes.object.isRequired,
    projectTemplates: React.PropTypes.object.isRequired,
    xsrf: React.PropTypes.string.isRequired,
    canCreateProject: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {open: false};
  },

  render() {
    const clName = this.state.open ? 'open' : '';
    return (
      <div className={`kbc-project-select dropdown ${clName}`}>
        <button onClick={this._handleDropdownClick} title={this.props.currentProject.get('name')}>
          <span>
            <span className="kbc-project-name">
              {this.props.currentProject.get('name')}
              {this.state.open ?
                <Icon.Times className="pull-right icon-size-16"/> :
                <Icon.ArrowDown className="pull-right icon-size-16"/>
              }
            </span>
          </span>
        </button>
        <div className="dropdown-menu">
          <ProjectsList
            organizations={this.props.organizations}
            currentProjectId={this.props.currentProject.get('id')}
            urlTemplates={this.props.urlTemplates}
            projectTemplates={this.props.projectTemplates}
            xsrf={this.props.xsrf}
            canCreateProject={this.props.canCreateProject}
            focus={this.state.open} />
        </div>
      </div>);
  },

  setDropdownState(newState) {
    this.setState({open: newState});
  },

  _handleDropdownClick(e) {
    e.preventDefault();
    this.setDropdownState(!this.state.open);
  }
});
