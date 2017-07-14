React = require 'react'

Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').Modal.Header)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').Modal.Body)
ModalFooter = React.createFactory(require('react-bootstrap').Modal.Footer)
Button = React.createFactory(require('react-bootstrap').Button)
ConfirmButtons = require('../../../../react/common/ConfirmButtons').default

OrchestrationActionCreators = require '../../ActionCreators'

{div, i, strong, form, input, label} = React.DOM

NewOrchestration = React.createClass
  displayName: 'NewOrchestration'

  getInitialState: ->
    isLoading: false
    isValid: false
    name: ''
    showModal: false

  close: ->
    @setState
      showModal: false

  open: ->
    @setState
      showModal: true

  render: ->
    div null,
      @renderOpenButton()
      Modal
        show: @state.showModal
        onHide: @close
      ,
        ModalHeader closeButton: true,
          ModalTitle null,
            'New Orchestration'

        ModalBody null,
          form className: 'form-horizontal', onSubmit: @_handleSubmit,
            div className: 'form-group',
              label className: 'col-sm-4 control-label', 'Name'
              div className: 'col-sm-6',
                input
                  placeholder: 'Orchestration name'
                  className: 'form-control'
                  value: @state.text
                  onChange: @_setName
                  ref: 'name'
                  autoFocus: true
        ModalFooter null,
          React.createElement ConfirmButtons,
            isSaving: @state.isLoading
            isDisabled: !@state.isValid
            saveLabel: 'Create'
            onCancel: @close
            onSave: @_handleCreate

  renderOpenButton: ->
    Button
      onClick: @open
      bsStyle: 'success'
    ,
      i className: 'kbc-icon-plus'
      'Add Orchestration'

  _handleSubmit: (e) ->
    e.preventDefault()
    @_handleCreate() if @state.isValid

  _handleCreate: ->
    @setState
      isLoading: true

    OrchestrationActionCreators.createOrchestration(
      name: @state.name
    ).then @close

  _setName: (e) ->
    name = e.target.value.trim()
    @setState
      name: name
      isValid: name.length > 0




module.exports = NewOrchestration
