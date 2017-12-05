React = require 'react'
ApplicationStore = require '../../stores/ApplicationStore'

images =
  green: require '@keboola/indigo-ui/src/indigo/img/status-green.svg'
  grey: require '@keboola/indigo-ui/src/indigo/img/status-grey.svg'
  orange: require '@keboola/indigo-ui/src/indigo/img/status-orange.svg'
  red: require '@keboola/indigo-ui/src/indigo/img/status-red.svg'

statusColorMap =
  success: 'green'
  error: 'red'
  warn: 'red'
  warning: 'red'
  processing: 'orange'
  cancelled: 'grey'
  waiting: 'grey'
  terminating: 'grey'
  terminated: 'grey'

JobStatusCircle = React.createClass
  displayName: 'JobStatusCircle'
  propTypes:
    status: React.PropTypes.string

  render: ->
    color = statusColorMap[@props.status] || 'grey'

    React.DOM.img
      src: @_getPathForColor color

  _getPathForColor: (color) ->
    ApplicationStore.getScriptsBasePath() + images[color]

module.exports = JobStatusCircle
