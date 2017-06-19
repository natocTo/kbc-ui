React = require('react')
Immutable = require('immutable')

ComponentsStore = require('../modules/components/stores/ComponentsStore')
RunComponentButton = React.createFactory(require '../modules/components/react/components/RunComponentButton')
WizardModal = React.createFactory(require './WizardModal')


{div, span, input, strong, form, button, h3, h4, i, button, small, ul, li, a} = React.DOM
Wizard = React.createClass

  displayName: 'Wizard'

  getInitialState: ->
    showWizardModal: true
    collapsed: '-aside'

  render: ->
    button {className: "btn btn-link", onClick: @_showWizardModal},
      i className: 'fa fa-fw fa-plus'
      ' Create modal'
    WizardModal {show: @state.showWizardModal, onHide: @_hideWizardModal, collapsed: 'aside'}

  _showWizardModal: ->
    @setState({showWizardModal: true})

  _hideWizardModal: ->
    @setState({showWizardModal: false})

module.exports = Wizard