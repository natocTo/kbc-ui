React = require('react')
Popover = React.createFactory(require('react-bootstrap').Popover)
OverlayTrigger = React.createFactory(require('react-bootstrap').OverlayTrigger)


{div, form, input,span, a} = React.DOM

QueryRow = React.createClass
  displayName: 'QueryRow'
  propTypes:
    onSearch: React.PropTypes.func.isRequired

  getInitialState: ->
    query: @props.query
    helpVisible: false

  _onQueryChange: (event) ->
    @setState
      query: event.target.value
  _doSearch: (event) ->
    @props.onSearch @state.query
    event.preventDefault()
  _renderPopover: =>
    if (@state.helpVisible)
      Popover
        title: "Help"
      ,
        'XXXX'


  render: ->
    form {onSubmit: @_doSearch},
      div {className: 'row kbc-search kbc-search-row'},
        span {className: 'kbc-icon-search'}
        input
          type: 'text'
          value: @state.query
          className: 'form-control'
          onChange: @_onQueryChange
          placeholder: 'search',
        OverlayTrigger
          placement: 'left'
          overlay: @_renderPopover()
        ,
          React.DOM.button className: 'btn btn-link',
            React.DOM.span className: 'fa fa-eye'

module.exports = QueryRow
