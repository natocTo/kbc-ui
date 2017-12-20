React = require 'react'
RouteHandler = React.createFactory(require('react-router').RouteHandler)
ApplicationStore = require '../../stores/ApplicationStore'

Header = React.createFactory(require '././Header')
SidebarNavigation = React.createFactory(require('././SidebarNavigation').default)
FloatingNotifications = require('./FloatingNotifications').default
ErrorPage = React.createFactory(require './../pages/ErrorPage')
LoadingPage = React.createFactory(require './../pages/LoadingPage')
ProjectSelect = React.createFactory(require('./project-select/ProjectSelect').default)
PageTitle = React.createFactory(require './PageTitle')
Wizard =  React.createFactory(require('../../modules/guide-mode/react/Wizard').default)
WizardStore = require('../../modules/guide-mode/stores/WizardStore').default
DisableGuideMode = require('../../modules/guide-mode/stores/ActionCreators').disableGuideMode

CurrentUser = React.createFactory(require('./CurrentUser').default)
UserLinks = React.createFactory(require './UserLinks')
classnames = require('classnames')

{div, a, i, p} = React.DOM

require '../../../styles/app.less'
require '../../modules/guide-mode/react/Guide.less'

App = React.createClass
  displayName: 'App'
  propTypes:
    isError: React.PropTypes.bool
    isLoading: React.PropTypes.bool
  getInitialState: ->
    organizations: ApplicationStore.getOrganizations()
    maintainers: ApplicationStore.getMaintainers()
    notifications: ApplicationStore.getNotifications()
    currentProject: ApplicationStore.getCurrentProject()
    currentAdmin: ApplicationStore.getCurrentAdmin()
    urlTemplates: ApplicationStore.getUrlTemplates()
    projectTemplates: ApplicationStore.getProjectTemplates()
    xsrf: ApplicationStore.getXsrfToken()
    canCreateProject: ApplicationStore.getCanCreateProject()
    canManageApps: ApplicationStore.getKbcVars().get 'canManageApps'
    projectHasGuideModeOn: ApplicationStore.getKbcVars().get 'projectHasGuideModeOn'
    homeUrl: ApplicationStore.getUrlTemplates().get 'home'
    projectFeatures: ApplicationStore.getCurrentProjectFeatures()
    projectBaseUrl: ApplicationStore.getProjectBaseUrl()
  render: ->
    div null,
      if @state.projectHasGuideModeOn == true
        div className: 'guide-status-bar',
          p null,
            'Guide Mode '
          p null,
            '\xa0- learn everything you need to know about Keboola Connection'
          a href: ApplicationStore.getProjectPageUrl('settings'),
            'Disable Guide Mode \xa0',
            i className: 'fa fa-times',
      PageTitle()
#      React.createElement(FloatingNotifications)
      div null,
        div null,
          div className: 'navbar navbar-inverse',
            div className: 'container',
              div className: 'navbar-header',
                a className: 'navbar-brand',
                  'Keboola'
              div className: 'navbar-collapse',
                CurrentUser
                  user: @state.currentAdmin
                  maintainers: @state.maintainers
                  urlTemplates: @state.urlTemplates
                  canManageApps: @state.canManageApps
                div className: 'nav navbar-nav navbar-right',
                  ProjectSelect
                    organizations: @state.organizations
                    currentProject: @state.currentProject
                    urlTemplates: @state.urlTemplates
                    xsrf: @state.xsrf
                    canCreateProject: @state.canCreateProject
                    projectTemplates: @state.projectTemplates

          div style: {backgroundColor: '#fff', paddingTop: '1em'},
            div className: 'container',
              SidebarNavigation()
          div null,
            Header
              homeUrl: @state.homeUrl
              notifications: @state.notifications
#            div null,
#              UserLinks()
          div null,
            div className: 'container',
              div className: 'kbc-main', style: {marginLeft: 0},
                if @props.isError
                  ErrorPage()
                else if @props.isLoading
                  LoadingPage()
                else
                  RouteHandler()
                if @state.projectHasGuideModeOn == true
                  Wizard
                    projectBaseUrl: @state.projectBaseUrl

module.exports = App
