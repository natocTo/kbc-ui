React = require 'react'
ExGdriveActionCreators = require '../../exGdriveActionCreators'

Tooltip = React.createFactory(require('./../../../../react/common/Tooltip').default)
OverlayTrigger = React.createFactory(require('./../../../../react/common/KbcBootstrap').OverlayTrigger)
Confirm = React.createFactory(require('../../../../react/common/Confirm').default)

{button, span, i} = React.DOM

###
  Enabled/Disabled orchestration button with tooltip
###
module.exports = React.createClass
  displayName: 'DeleteSheetButton'
  propTypes:
    sheet: React.PropTypes.object.isRequired
    configurationId: React.PropTypes.string.isRequired

  render: ->
    Confirm
      title: 'Delete Sheet'
      text: "Do you really want to delete the sheet?"
      buttonLabel: 'Delete'
      onConfirm: @_deleteQuery
    ,
      Tooltip
        tooltip: 'Delete Sheet'
        id: 'delete'
        placement: 'top'
      ,
        button className: 'btn btn-link',
          i className: 'kbc-icon-cup fa-fw'

  _deleteQuery: ->
    ExGdriveActionCreators.deleteSheet @props.configurationId, @props.sheet.get('fileId'), @props.sheet.get('sheetId')
