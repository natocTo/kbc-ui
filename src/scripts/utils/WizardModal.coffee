React = require 'react'
Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').ModalHeader)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').ModalBody)
ModalFooter = React.createFactory(require('react-bootstrap').ModalFooter)
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('react-bootstrap').Button)
ApplicationStore = require '../stores/ApplicationStore'


Link = React.createFactory(require('react-router').Link)

RoutesStore = require '../stores/RoutesStore'

{p, a, h4, span, href, ul, li} = React.DOM

WizardModal = React.createClass
  displayName: 'WizardModal'

  propTypes:
    onHide: React.PropTypes.func.isRequired
    show: React.PropTypes.bool.isRequired
    collapsed: React.PropTypes.string.isRequired

  render: ->
    Modal
      show: @props.show,
      onHide: @props.onHide,
      className: 'wiz wiz-' + @props.collapsed,
      backdrop: false,
      ModalHeader closeButton: true,
        ModalTitle null,
          "Wizard"
      ModalBody null,
        p {},
          "text "
        ul
          li
            Link to: 'extractors',
              span className: 'kbc-orchestration'
              span null, 'extractors'
          li
            Link to: 'writers',
              span className: 'kbc-orchestration'
              span null, 'writers'

      ModalFooter null,
        ButtonToolbar null,
          Button
            onClick: @props.onHide
          ,
            'Close'

  _getPageId: ->
    return 'writers'

module.exports = WizardModal