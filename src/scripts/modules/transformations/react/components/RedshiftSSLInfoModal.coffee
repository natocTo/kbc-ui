React = require 'react'
Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap/lib/ModalHeader'))
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap/lib/ModalBody'))
ModalFooter = React.createFactory(require('react-bootstrap/lib/ModalFooter'))
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('react-bootstrap').Button)

{p, a, h4} = React.DOM

RedshiftSSLInfoModal = React.createClass
  displayName: 'RedshiftSSLInfoModal'

  propTypes:
    onHide: React.PropTypes.func.isRequired
    show: React.PropTypes.bool.isRequired

  render: ->
    Modal show: @props.show, onHide: @props.onHide,
      ModalHeader closeButton: true,
        ModalTitle null,
          "Redshift SSL Connection"
      ModalBody null,
        p {},
          "To establish a secure connection to Redshift follow AWS "
          a {href: "http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html"},
            "Configure Security Options for Connections"
          " guide."
      ModalFooter null,
        ButtonToolbar null,
          Button
            onClick: @props.onHide
          ,
            'Close'

module.exports = RedshiftSSLInfoModal
