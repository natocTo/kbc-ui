React = require 'react'
ExGanalctionCreators = require '../../exGanalActionCreators'

Tooltip = React.createFactory(require('./../../../../react/common/Tooltip').default)
OverlayTrigger = React.createFactory(require('./../../../../react/common/KbcBootstrap').OverlayTrigger)
Confirm = React.createFactory(require('../../../../react/common/Confirm').default)

{button, span, i} = React.DOM

###
  Enabled/Disabled orchestration button with tooltip
###
module.exports = React.createClass
  displayName: 'DeleteQueryButton'
  propTypes:
    queryName: React.PropTypes.string.isRequired
    configurationId: React.PropTypes.string.isRequired

  render: ->
    Confirm
      title: 'Delete Query'
      text: "Do you really want to delete the query?"
      buttonLabel: 'Delete'
      onConfirm: @_deleteQuery
    ,
      Tooltip
        tooltip: 'Delete Query'
        id: 'delete'
        placement: 'top'
      ,
        button className: 'btn btn-link',
          i className: 'kbc-icon-cup'

  _deleteQuery: ->
    ExGanalctionCreators.deleteQuery @props.configurationId, @props.queryName
