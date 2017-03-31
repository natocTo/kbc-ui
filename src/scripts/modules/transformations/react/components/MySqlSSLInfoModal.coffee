React = require 'react'
Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').ModalHeader)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').ModalBody)
ModalFooter = React.createFactory(require('react-bootstrap').ModalFooter)
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('react-bootstrap').Button)

{p, a, h4} = React.DOM

MySqlSSLInfoModal = React.createClass
  displayName: 'MySqlSSLInfoModal'

  propTypes:
    onHide: React.PropTypes.func.isRequired
    show: React.PropTypes.bool.isRequired

  render: ->
    Modal show: @props.show, onHide: @props.onHide,
      ModalHeader closeButton: true,
        ModalTitle null,
          "MySQL SSL Connection"
      ModalBody null,
        p {},
          "For instructions to establish a secure connection to MySQL sandbox see "
          a {href: "https://help.keboola.com/manipulation/transformations/sandbox/#connecting-to-sandbox"},
            "the documentation"
          "."
      ModalFooter null,
        ButtonToolbar null,
          Button
            onClick: @props.onHide
          ,
            'Close'

module.exports = MySqlSSLInfoModal
