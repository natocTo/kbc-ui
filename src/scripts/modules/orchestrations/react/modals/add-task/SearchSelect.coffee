React = require 'react'
ComponentIcon = React.createFactory(require('../../../../../react/common/ComponentIcon').default)
ComponentName = React.createFactory(require('../../../../../react/common/ComponentName').default)

{div, h2, a, table, tbody, tr, td, span, div, i} = React.DOM

ComponentSelect = React.createClass
  displayName: 'SearchSelect'
  propTypes:
    components: React.PropTypes.object.isRequired
    orchestrations: React.PropTypes.object.isRequired
    onComponentSelect: React.PropTypes.func.isRequired
    onConfigurationSelect: React.PropTypes.func.isRequired

  render: ->
    div null,
      @_renderSection('Extractors', @_getComponentsForType('extractor')),
      @_renderSection('Transformations', @_getComponentsForType('transformation')),
      @_renderSection('Writers', @_getComponentsForType('writer'))
      @_renderSection('Applications', @_getComponentsForType('application'))
      @_renderOrchestratorSection('Orchestrations', @props.components.filter((c) -> c.get('id') == 'orchestrator'))

  _renderSection: (title, components) ->
    if !components || components.size == 0
      return span null
    components = components.map((component) ->
      tr null,
        td null,
          div null,
            a
              key: component.get('id')
              onClick: @_handleComponentSelect.bind(@, component)
            ,
              ComponentIcon component: component
              ' '
              ComponentName component: component
              ' '
              span className: 'kbc-icon-arrow-right pull-right'
          if component.get('configurations').size > 0
            div className: 'list-group',
              component.get('configurations').map((configuration) ->
                a
                  className: 'list-group-item'
                  key: configuration.get('id')
                  onClick: @_handleConfigurationSelect.bind(@, component, configuration)
                ,
                  configuration.get('name')
                  i className: 'fa fa-plus-circle pull-right'
              , @).toArray()

    , @).toArray()

    div null,
      h2 null, title
      table className: 'table table-striped table-hover kbc-tasks-list',
        tbody null,
          components

  _renderOrchestratorSection: (title, components) ->
    if !components || components.size == 0
      return span null
    components = components.map((component) ->
      tr null,
        td null,
          div null,
            a
              key: component.get('id')
              onClick: @_handleComponentSelect.bind(@, component)
            ,
              ComponentIcon component: component
              ' '
              ComponentName component: component
              ' '
              span className: 'kbc-icon-arrow-right pull-right'
          if component.get('configurations').size > 0
            div className: 'list-group',
              component.get('configurations').map((configuration) ->
                a
                  className: 'list-group-item'
                  key: configuration.get('id')
                  onClick: @_handleConfigurationSelect.bind(@, component, configuration)
                ,
                  configuration.get('name')
                  i className: 'fa fa-plus-circle pull-right'
              , @).toArray()
    , @).toArray()

    div null,
      h2 null, title
      table className: 'table table-striped table-hover kbc-tasks-list',
        tbody null,
          components if @props.orchestrations.count()

  _handleComponentSelect: (component) ->
    @props.onComponentSelect(component)

  _handleConfigurationSelect: (component, configuration) ->
    @props.onConfigurationSelect(component, configuration)


  _getComponentsForType: (type, filter) ->
    @props.components.filter((component) ->
      component.get('type') == type
    )


module.exports = ComponentSelect
