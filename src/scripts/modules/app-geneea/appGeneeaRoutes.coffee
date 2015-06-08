genericIndex = require '../app-geneea/react/pages/index/Index'
genericHeaderButtons = require './react/components/detailHeaderButtons'

installedComponentsActions = require '../components/InstalledComponentsActionCreators'
IntalledComponentsStore = require '../components/stores/InstalledComponentsStore'
JobsActionCreators = require '../jobs/ActionCreators'

createRoute = (componentId) ->
  name: componentId
  path: "#{componentId}/:config"
  isComponent: true
  requireData: [
    (params) ->
      installedComponentsActions.loadComponentConfigData componentId, params.config
  ]
  title: (routerState) ->
    configId = routerState.getIn ['params', 'config']
    IntalledComponentsStore.getConfig(componentId, configId).get 'name'
  poll:
    interval: 5
    action: (params) ->
      JobsActionCreators.loadComponentConfigurationLatestJobs(componentId, params.config)
  defaultRouteHandler: genericIndex(componentId)
  headerButtonsHandler: genericHeaderButtons(componentId)



module.exports = createRoute 'geneea-topic-detection'
