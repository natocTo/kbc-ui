React = require 'react'
Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').Modal.Header)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').Modal.Body)
ModalFooter = React.createFactory(require('react-bootstrap').Modal.Footer)
ConfirmButtons = React.createFactory(require('../../../../react/common/ConfirmButtons').default)
Button = React.createFactory(require('./../../../../react/common/KbcBootstrap').Button)

TransformationActionCreators = require '../../ActionCreators'

{div, p, span, form, input, label, textarea, i} = React.DOM

module.exports = React.createClass
  displayName: 'NewTransformationBucket'

  componentDidMount: ->
    @refs.name?.focus()

  props:
    label: React.PropTypes.string.isRequired

  getInitialState: ->
    isLoading: false
    name: ''
    description: ''
    showModal: false

  close: ->
    @setState
      showModal: false

  open: ->
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
            'New Transformation Bucket'

        ModalBody null,
          form className: 'form-horizontal', onSubmit: @_handleSubmit,
            p className: 'help-block',
              'Transformation bucket is a container for related transformations.'
              ' '
              'When the bucket is created you can start creating transformations inside it'
            div className: 'form-group',
              label className: 'col-sm-4 control-label', 'Name'
              div className: 'col-sm-6',
                input
                  placeholder: 'Main'
                  className: 'form-control'
                  value: @state.text
                  onChange: @_setName
                  ref: 'name'
                  autoFocus: true
            div className: 'form-group',
              label className: 'col-sm-4 control-label', 'Description'
              div className: 'col-sm-6',
                textarea
                  placeholder: 'Main transformations'
                  className: 'form-control'
                  value: @state.description
                  onChange: @_setDescription
                  ref: 'description',

        ModalFooter null,
          ConfirmButtons
            isSaving: @state.isLoading
            isDisabled: !@_isValid()
            saveLabel: 'Create'
            onCancel: @close
            onSave: @_handleCreate

  renderOpenButton: ->
    Button
      onClick: @open
      bsStyle: 'success'
    ,
      i className: 'fa fa-plus'
      ' '
      @props.label

  _handleSubmit: (e) ->
    e.preventDefault()
    @_handleCreate() if @_isValid()

  _handleCreate: ->
    @setState
      isLoading: true

    TransformationActionCreators.createTransformationBucket(
      name: @state.name
      description: @state.description
    ).then @close

  _setName: (e) ->
    name = e.target.value.trim()
    @setState
      name: name

  _setDescription: (e) ->
    description = e.target.value
    @setState
      description: description

  _isValid: ->
    @state.name.length > 0
