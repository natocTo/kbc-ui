React = require 'react'

createStoreMixin = require '../../../../react/mixins/createStoreMixin'
InstalledComponentsActionCreators = require '../../InstalledComponentsActionCreators'
InstalledComponetsStore = require '../../stores/InstalledComponentsStore'
RefreshIcon = React.createFactory(require('kbc-react-components').RefreshIcon)

module.exports = React.createClass
  displayName: 'ComponentsReloaderButton'
  mixins: [createStoreMixin(InstalledComponetsStore)]

  getStateFromStores: ->
    isLoading: InstalledComponetsStore.getIsLoading() || InstalledComponetsStore.getIsDeletedLoading()

  _handleRefreshClick: ->
    InstalledComponentsActionCreators.loadComponentsForce()

  render: ->
    RefreshIcon isLoading: @state.isLoading, onClick: @_handleRefreshClick
