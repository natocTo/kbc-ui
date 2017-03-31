React = require('react')
OptionsForm = require '../../components/optionsForm'
Immutable = require 'immutable'
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('react-bootstrap').Button)
Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').Modal.Header)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').Modal.Body)
ModalFooter = React.createFactory(require('react-bootstrap').Modal.Footer)
OptionsForm = React.createFactory OptionsForm
Loader = React.createFactory(require('kbc-react-components').Loader)

{i, span, div, p, strong, form, input, label, div} = React.DOM

module.exports = React.createClass
  displayName: 'optionsModal'

  propTypes:
    parameters: React.PropTypes.object
    updateParamsFn: React.PropTypes.func
    isUpdating: React.PropTypes.bool

  getInitialState: ->
    parameters: @props.parameters
    showModal: false

  ComponentWillReceiveProps: (newProps) ->
    @setState
      parameters: newProps.parameters

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
            'Options'

        ModalBody null,
          OptionsForm
            parameters: @state.parameters
            onChangeParameterFn: @_handleChangeParam

        ModalFooter null,
          ButtonToolbar null,
            if @props.isUpdating
              Loader()
            Button
              onClick: @close
              disabled: @props.isUpdating
              bsStyle: 'link'
            ,
              'Cancel'
            Button
              onClick: @_handleConfirm
              disabled: @props.isUpdating
              bsStyle: 'success'
            ,
              'Save'

  renderOpenButton: ->
    span
      onClick: @open
      className: 'btn btn-link',
      i className: 'fa fa-fw fa-gear'
      ' Options'

  _handleConfirm: ->
    @props.updateParamsFn(@state.parameters).then =>
      @close()

  _handleChangeParam: (param, value) ->
    newParameters = @state.parameters.set(param, value)
    @setState
      parameters: newParameters
