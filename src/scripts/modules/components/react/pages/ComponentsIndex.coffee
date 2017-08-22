React = require 'react'
_ = require 'underscore'
{Map, List} = require 'immutable'

createStoreMixin = require '../../../../react/mixins/createStoreMixin'
InstalledComponentsStore = require '../../stores/InstalledComponentsStore'
ComponentsStore = require '../../stores/ComponentsStore'
InstalledComponentsActionCreators = require '../../InstalledComponentsActionCreators'
SearchRow = require('../../../../react/common/SearchRow').default
ApplicationStore = require '../../../../stores/ApplicationStore'

ComponentRow = require('./ComponentRow').default

NewComponentSelection = require '../components/NewComponentSelection'

{div, table, tbody, tr, td, ul, li, a, span, small, strong, h2} = React.DOM

TEXTS =
  noComponents:
    extractor: 'Extractors allow you to collect data from various sources.'
    writer: 'Writers allow you to send data to various destinations.'
    application: 'Use applications to enhance, modify or better understand your data.'
  installFirst:
    extractor: 'Get started with your first extractor!'
    writer: 'Get started with your first writer!'
    application: 'Get started with your first application!'

snowflakeEnabled = List([
  "keboola.ex-google-drive",
  "ex-adform",
  "keboola.csv-import",
  "keboola.ex-github",
  "keboola.ex-gcalendar",
  "keboola.ex-mongodb",
  "keboola.ex-db-mysql",
  "keboola.ex-db-pgsql",
  "keboola.ex-intercom",
  "keboola.ex-db-redshift",
  "ex-salesforce",
  "keboola.ex-zendesk",
  "esnerda.ex-bingads",
  "keboola.ex-db-impala",
  "keboola.ex-db-db2",
  "ex-dropbox",
  "keboola.ex-gmail",
  "ex-gooddata",
  "keboola.ex-google-analytics-v4",
  "ex-google-bigquery",
  "esnerda.ex-mailkit",
  "keboola.ex-db-oracle",
  "keboola.ex-slack",
  "keboola.ex-db-mssql"
  "keboola.ex-stripe"
])


module.exports = React.createClass
  displayName: 'InstalledComponents'
  mixins: [createStoreMixin(InstalledComponentsStore, ComponentsStore)]
  propTypes:
    type: React.PropTypes.string.isRequired

  getStateFromStores: ->
    components = ComponentsStore.getFilteredForType(@props.type).filter( (component) ->
      if component.get('flags').includes('excludeFromNewList')
        return false
      if ApplicationStore.hasCurrentProjectFeature('ui-snowflake-demo') &&
          !snowflakeEnabled.contains(component.get('id'))
        return false
      return true
    )

    installedComponentsFiltered: InstalledComponentsStore.getFilteredComponents(@props.type)
    installedComponents: InstalledComponentsStore.getAllForType(@props.type)
    deletingConfigurations: InstalledComponentsStore.getDeletingConfigurations()
    components: components
    componentFilter: ComponentsStore.getComponentFilter(@props.type)
    configurationFilter: InstalledComponentsStore.getConfigurationFilter(@props.type)

  render: ->
    if @state.installedComponents.count()
      rows =  @state.installedComponentsFiltered.map((component) ->
        React.createElement ComponentRow,
          component: component
          deletingConfigurations: @state.deletingConfigurations.get(component.get('id'), Map())
          key: component.get('id')
      , @).toArray()

      div className: 'container-fluid kbc-main-content kbc-components-list',
        React.createElement SearchRow,
          className: 'row kbc-search-row'
          onChange: @_handleFilterChange
          query: @state.configurationFilter
        if @state.installedComponentsFiltered.count()
          rows
        else
          div className: 'kbc-header',
            div className: 'kbc-title',
              h2 null,
                'No ' + @props.type + 's found.'

    else
      React.createElement NewComponentSelection,
        className: 'container-fluid kbc-main-content'
        components: @state.components
        componentFilter: @state.componentFilter
        componentType: @props.type
      ,
        div className: 'row',
          React.DOM.h2 null, TEXTS['noComponents'][@props.type]
          React.DOM.p null, TEXTS['installFirst'][@props.type]

  _handleFilterChange: (query) ->
    InstalledComponentsActionCreators.setInstalledComponentsConfigurationFilter(@props.type, query)

