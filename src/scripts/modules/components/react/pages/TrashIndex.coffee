React = require 'react'
_ = require 'underscore'
{Map, List} = require 'immutable'

createStoreMixin = require '../../../../react/mixins/createStoreMixin'
InstalledComponentsStore = require '../../stores/InstalledComponentsStore'
ComponentsStore = require '../../stores/ComponentsStore'
InstalledComponentsActionCreators = require '../../InstalledComponentsActionCreators'
ApplicationStore = require '../../../../stores/ApplicationStore'

ComponentRow = require('./ComponentRow').default
SplashIcon = require('../../../../react/common/SplashIcon').default

{div, table, tbody, tr, td, ul, li, a, span, small, strong} = React.DOM

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
  displayName: 'DeletedComponents'
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

    installedComponents: InstalledComponentsStore.getAllDeletedForType(@props.type)
    deletingConfigurations: InstalledComponentsStore.getDeletingConfigurations()
    restoringConfigurations: InstalledComponentsStore.getRestoringConfigurations()
    components: components
    filter: ComponentsStore.getFilter(@props.type)

  render: ->
    if @state.installedComponents.count()
      rows =  @state.installedComponents.map((component) ->
        React.createElement ComponentRow,
          component: component
          deletingConfigurations: @state.deletingConfigurations.get(component.get('id'), Map())
          restoringConfigurations: @state.restoringConfigurations.get(component.get('id'), Map())
          key: component.get('id')
      , @).toArray()

      div className: 'container-fluid kbc-main-content kbc-components-list',
        rows
    else
      React.createElement SplashIcon,
        icon: 'kbc-icon-cup'
        label: 'Trash is empty'
