React = require 'react'

Modal = React.createFactory(require('react-bootstrap').Modal)
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('react-bootstrap').Button)

{div, p} = React.DOM


ConfirmModal = React.createClass
  displayName: 'ConfirmModal'

  propTypes: {
    buttonType: React.PropTypes.string,
    buttonLabel: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired
    show: React.PropTypes.bool.isRequired
  }

  render: ->
    Modal title: @props.title, onHide: @props.onHide, show: @props.show,
      div className: 'modal-body',
        p null,
          @props.text
      div className: 'modal-footer',
        ButtonToolbar null,
          Button
            onClick: @props.onHide
            bsStyle: 'link'
          ,
            'Cancel'
          Button
            bsStyle: @props.buttonType
            onClick: @_handleConfirm
          ,
            @props.buttonLabel

  _handleConfirm: ->
    @props.onHide()
    @props.onConfirm()

module.exports = ConfirmModal
