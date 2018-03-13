React = require 'react'

Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').Modal.Header)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').Modal.Body)
ModalFooter = React.createFactory(require('react-bootstrap').Modal.Footer)
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('react-bootstrap').Button)
SqlDepAnalyzerApi = require '../../../sqldep-analyzer/Api'

{p, a, span, i} = React.DOM


SqlDepModal = React.createClass
  displayName: 'SqlDepModal'

  getInitialState: ->
    isLoading: false
    sqlDepUrl: null
    showModal: false

  close: ->
    @setState
      showModal: false
      isLoading: false
      sqlDepUrl: null

  onAnalyze: ->
    @setState
      isLoading: true
    component = @
    SqlDepAnalyzerApi
    .getGraph(@props.bucketId, @props.transformationId)
    .then((response) ->
      component.setState
        isLoading: false
        sqlDepUrl: response.url
    )

  open: ->
    @setState
      showModal: true

  betaWarning: ->
    if (@props.backend == 'snowflake')
      span null,
        ' '
        span className: 'label label-info',
          'BETA'

  render: ->
    a onClick: @handleOpenButtonClick,
      i className: 'fa fa-sitemap fa-fw'
      ' SQLDep'
      @betaWarning()
      Modal
        show: @state.showModal
        onHide: @close
      ,
        ModalHeader closeButton: true,
          ModalTitle null,
            'SQLdep'

        ModalBody null,
          @_renderBody()

        ModalFooter null,
          ButtonToolbar null,
            Button
              onClick: @close
              bsStyle: 'link'
            ,
              'Close'
            Button
              disabled: @state.isLoading || !!@state.sqlDepUrl
              onClick: @onAnalyze
              className: 'btn-primary'
            ,
              if @state.isLoading
                'Running'
              else
                'Run'


  handleOpenButtonClick: (e) ->
    e.preventDefault()
    @open()

  renderSqlDepUrl: ->
    if @state.sqlDepUrl
      span {},
        p {},
          'SQLdep is ready at '
          a {href: @state.sqlDepUrl, target: '_blank'},
            @state.sqlDepUrl
          '.'

  _renderBody: ->
    if @props.backend == 'redshift' || @props.backend == 'snowflake'
      span null,
        p null,
          'Visual SQL analysis will send the SQL queries (including comments) and table details to '
          a href: 'https://sqldep.com/',
            'SQLdep API'
          '. Although the URL will be only available here, the result is not secured any further.'
        @renderSqlDepUrl()

    else
      [
        p {},
          'Visual SQL analysis is available for Redshift and Snowflake transformations only.'
      ]

  _handleConfirm: ->
    @close()
    @props.onConfirm()

module.exports = SqlDepModal
