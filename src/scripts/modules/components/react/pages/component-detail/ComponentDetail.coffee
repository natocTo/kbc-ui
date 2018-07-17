React = require 'react'
fuzzy = require('fuzzy')

createStoreMixin = require '../../../../../react/mixins/createStoreMixin'
RoutesStore = require '../../../../../stores/RoutesStore'
ComponentsStore = require '../../../stores/ComponentsStore'
InstalledComponentsStore = require '../../../stores/InstalledComponentsStore.coffee'
InstalledComponentsActionCreators = require '../../../InstalledComponentsActionCreators'
ApplicationStore = require '../../../../../stores/ApplicationStore'

VendorInfo = React.createFactory(require './VendorInfo.coffee')
ComponentDescription = React.createFactory(require './ComponentDescription.coffee')
ConfigurationRow = require('../ConfigurationRow.jsx').default
Immutable = require 'immutable'
ComponentEmptyState = require('../../components/ComponentEmptyState').default
AddComponentConfigurationButton = React.createFactory(require '../../components/AddComponentConfigurationButton')

FormHeader = require('../new-component-form/FormHeader')
VendorInfo = require('../component-detail/VendorInfo')
AppUsageInfo = React.createFactory(require('../new-component-form/AppUsageInfo').default)
ComponentDescription = require '../component-detail/ComponentDescription'
contactSupport = require('../../../../../utils/contactSupport').default
MigrationRow = require('../../components/MigrationRow').default
SearchRow = require('../../../../../react/common/SearchRow').default

CONFIGURATIONS_COUNT_LIMIT = 2

{a, div, label, h3, h2, span, p} = React.DOM

module.exports = React.createClass
  displayName: 'ComponentDetail'
  mixins: [createStoreMixin(ComponentsStore, InstalledComponentsStore)]
  propTypes:
    component: React.PropTypes.string

  getStateFromStores: ->
    componentId = if @props.component then @props.component else RoutesStore.getCurrentRouteParam('component')
    component = ComponentsStore.getComponent(componentId)

    if (InstalledComponentsStore.getDeletingConfigurations())
      deletingConfigurations = InstalledComponentsStore.getDeletingConfigurations()
    else
      deletingConfigurations = Immutable.Map()

    componentWithConfigurations = InstalledComponentsStore.getComponent(component.get('id'))
    configurations = Immutable.Map()
    if componentWithConfigurations
      configurations = componentWithConfigurations.get("configurations", Immutable.Map())

    state =
      component: component
      configurations: configurations
      deletingConfigurations: deletingConfigurations.get(component.get('id'), Immutable.Map())
      configurationFilter: InstalledComponentsStore.getConfigurationFilter(component.get('type'))
    state

  render: ->
    div className: "container-fluid",
      if @_isDeprecated()
        React.createElement MigrationRow,
        componentId: @state.component.get('id')
        replacementAppId: @state.component.getIn(['uiOptions', 'replacementApp'])
      div className: "kbc-main-content",
        React.createElement FormHeader,
          component: @state.component
          withButtons: false
        div className: "row",
          div className: "col-md-6",
            AppUsageInfo
              component: @state.component
          div className: "col-md-6",
            React.createElement VendorInfo,
              component: @state.component
        if (@state.component.get('longDescription'))
          div className: "row",
            div className: "col-md-12",
              React.createElement ComponentDescription,
                component: @state.component
        @_renderConfigurations()

  _getFilteredConfigurations: ->
    filtered = @state.configurations
    if @state.configurationFilter or @state.configurationFilter != ''
      filterQuery = @state.configurationFilter
      filtered = @state.configurations.filter (configuration) ->
        fuzzy.match(filterQuery, configuration.get('name', '').toString()) or
          fuzzy.match(filterQuery, configuration.get('id', '').toString()) or
          fuzzy.match(filterQuery, configuration.get('description', '').toString())
    return filtered

  _isDeprecated: ->
    return @state.component.get('flags').includes('deprecated')

  _handleFilterChange: (query) ->
    InstalledComponentsActionCreators.setInstalledComponentsConfigurationFilter(@state.component.get('type'), query)

  _renderConfigurations: ->
    hasRedshift = ApplicationStore.getSapiToken().getIn ['owner', 'hasRedshift']
    needsRedshift = @state.component.get('flags').includes('appInfo.redshiftOnly')

    if needsRedshift and not hasRedshift
      return div className: 'row',
        span {},
          "Redshift is not enabled for this project, please "
        ,
          a {onClick: @_openSupportModal}, "contact us"
        ,
          " to get more info."

    state = @state
    if @state.configurations.count()
      div null,
        div className: "kbc-header",
          div className: "kbc-title",
            h2 null, "Configurations"
            span className: "pull-right",
              if @state.configurations.count() <= CONFIGURATIONS_COUNT_LIMIT
                AddComponentConfigurationButton
                  disabled: @_isDeprecated()
                  component: state.component
        if @state.configurations.count() > CONFIGURATIONS_COUNT_LIMIT
          div className: 'col-md-12',
            div className: 'row',
              div className: 'col-md-9',
                React.createElement SearchRow,
                  className: 'row kbc-search-row'
                  onChange: @_handleFilterChange
                  query: @state.configurationFilter
              div className: 'col-md-3',
                AddComponentConfigurationButton
                  disabled: @_isDeprecated()
                  component: state.component

        if @_getFilteredConfigurations().count()
          div className: "table table-hover",
            div className: "tbody",
              @_getFilteredConfigurations()
                .map((configuration) =>
                  React.createElement(ConfigurationRow,
                    component: @state.component,
                    config: configuration,
                    componentId: state.component.get('id'),
                    isDeleting: state.deletingConfigurations.has(configuration.get('id')),
                    key: configuration.get('id')
                  )
                )
        else
          div className: 'kbc-header',
            div className: 'kbc-title',
              h2 null,
                'No configurations found.'
    else
      div className: "row kbc-row",
        React.createElement ComponentEmptyState, null,
          div className: "text-center",
            AddComponentConfigurationButton
              disabled: false
              label: "New Configuration"
              component: state.component

  _openSupportModal: (e) ->
    contactSupport(type: 'project')
    e.preventDefault()
    e.stopPropagation()
