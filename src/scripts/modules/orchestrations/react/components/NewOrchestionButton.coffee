React = require 'react'

NewOrchestrationModal = React.createFactory(require '../modals/NewOrchestration')

module.exports = React.createClass
  displayName: 'NewOrchestrationButton'

  render: ->
    NewOrchestrationModal null
