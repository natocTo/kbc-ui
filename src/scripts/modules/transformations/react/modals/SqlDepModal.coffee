React = require 'react'

Modal = React.createFactory(require('./../../../../react/common/KbcBootstrap').Modal)
ModalHeader = React.createFactory(require('./../../../../react/common/KbcBootstrap').Modal.Header)
ModalTitle = React.createFactory(require('./../../../../react/common/KbcBootstrap').Modal.Title)
ModalBody = React.createFactory(require('./../../../../react/common/KbcBootstrap').Modal.Body)
ModalFooter = React.createFactory(require('./../../../../react/common/KbcBootstrap').Modal.Footer)
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('./../../../../react/common/KbcBootstrap').Button)
api = require '../../TransformationsApiAdapter'
Loader = React.createFactory(require('kbc-react-components').Loader)

{div, p, a, strong, code, span, i} = React.DOM


SqlDepModal = React.createClass
  displayName: 'SqlDepModal'

  getInitialState: ->
    isLoading: true
    sqlDepUrl: null
    showModal: false

  close: ->
    @setState
      showModal: false
      isLoading: false

  open: ->
    @setState
      showModal: true

    if (@props.backend == 'redshift')
      @setState
        isLoading: true
      component = @
      api
      .getSqlDep(
        configBucketId: @props.bucketId
        transformations: [@props.transformationId]
      )
      .then((response) ->
        component.setState
          isLoading: false
          sqlDepUrl: response.url
      )

  render: ->
    a onClick: @handleOpenButtonClick,
      i className: 'fa fa-sitemap fa-fw'
      ' SQLDep'
      Modal
        show: @state.showModal
        onHide: @close
      ,
        ModalHeader closeButton: true,
          ModalTitle null,
            'SQLDep'

        ModalBody null,
          @_renderBody()

        ModalFooter null,
          ButtonToolbar null,
            Button
              onClick: @close
              bsStyle: 'link'
            ,
              'Close'

  handleOpenButtonClick: (e) ->
    e.preventDefault()
    @open()

  _renderBody: ->
    if @props.backend == 'redshift'
      if @state.isLoading
        p null,
          Loader {}
          ' '
          'Loading SQLdep data. This may take a minute or two...'
      else if !@state.isLoading
        span {},
          p {},
            'SQLdep is ready. '
            a {href: @state.sqlDepUrl, target: '_blank'},
              'Open SQLDep '
              i className: 'fa fa-external-link'
    else
      [
        p {},
          'Visual SQL analysis is available for Redshift transformations only. ',
        p {},
          'Contact '
          a {href: 'mailto:support@keboola.com'}, 'support@keboola.com'
          ' for more information.'
      ]

  _handleConfirm: ->
    @close()
    @props.onConfirm()

module.exports = SqlDepModal
