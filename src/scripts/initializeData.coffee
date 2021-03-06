_ = require 'underscore'
ComponentsActionCreators = require './modules/components/ComponentsActionCreators'
ServicesActionCreators = require('./modules/services/ActionCreators').default
InstalledComponentsActionCreators = require './modules/components/InstalledComponentsActionCreators'
OrchestrationsActionCreators = require './modules/orchestrations/ActionCreators'

module.exports = (initialData) ->
  _.forEach(initialData, (data, name) ->
    switch name
      when 'components'
        ComponentsActionCreators.receiveAllComponents(data)

      when 'services'
        ServicesActionCreators.receive(data)

      when 'installedComponents'
        InstalledComponentsActionCreators.receiveAllComponents(data)

      when 'orchestrations'
        OrchestrationsActionCreators.receiveAllOrchestrations(data)
  )
