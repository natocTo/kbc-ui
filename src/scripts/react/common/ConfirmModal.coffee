React = require 'react'

Modal = React.createFactory(require('./KbcBootstrap').Modal)
ButtonToolbar = React.createFactory(require('./KbcBootstrap').ButtonToolbar)
Button = React.createFactory(require('./KbcBootstrap').Button)
ModalHeader = React.createFactory(require('./KbcBootstrap').Modal.Header)
ModalTitle = React.createFactory(require('./KbcBootstrap').Modal.Title)
ModalBody = React.createFactory(require('./KbcBootstrap').Modal.Body)
ModalFooter = React.createFactory(require('./KbcBootstrap').Modal.Footer)

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
    Modal onHide: @props.onHide, show: @props.show,
      ModalHeader closeButton: true,
        ModalTitle null,
          @props.title
      ModalBody null,
        p null,
          @props.text
      ModalFooter null,
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
