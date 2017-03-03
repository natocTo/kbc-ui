React = require 'react'
InstalledComponentsActionCreators = require '../../../components/InstalledComponentsActionCreators'

Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').Modal.Header)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').Modal.Body)
ModalFooter = React.createFactory(require('react-bootstrap').Modal.Footer)
ConfirmButtons = require('../../../../react/common/ConfirmButtons').default

{span} = React.DOM

module.exports = React.createClass

  propTypes:
    configId: React.PropTypes.string.isRequired

  _handleRun: ->
    @close()
    @props.onRequestRun()


  getInitialState: ->
    showModal: false
    isLoading: false

  close: ->
    @setState
      showModal: false

  open: ->
    @props.onOpen()
    @setState
      showModal: true

  render: ->
    span null,
      @renderOpenButton()
      Modal
        show: @state.showModal
        onHide: @close
      ,
        ModalHeader closeButton: true,
          ModalTitle null,
            'Run extraction ' + @props.runParams.account

        ModalBody null,
          p null
            'You are about to run the extraction ' + @props.runParams.account

        ModalFooter null,
          React.createElement ConfirmButtons,
            isDisabled: false
            saveLabel: 'Run'
            onCancel: @_handleCancel()
            onSave: @_handleRun()

  _handleRunStart: ->
    @setState
      isLoading: true

    InstalledComponentsActionCreators
    .runComponent
      component: 'ex-google-drive'
      data:
        account: @props.runParams.account
    .then @_handleStarted

  _handleStarted: ->
    @setState
      isLoading: false

