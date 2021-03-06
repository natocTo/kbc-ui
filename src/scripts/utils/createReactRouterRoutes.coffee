###
  Converts routes configuration nested object to React Router components structure
  Example output:
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} />
    <Route name="about" handler={About} />
    <Route name="users" handler={Users}>
      <Route name="recent-users" path="recent" handler={RecentUsers} />
      <Route name="user" path="/user/:userId" handler={User} />
      <NotFoundRoute handler={UserRouteNotFound}/>
    </Route>
    <NotFoundRoute handler={NotFound}/>
    <Redirect from="company" to="about" />
  </Route>
###

React = require 'react'
Router = require 'react-router'

RouteHandler = React.createFactory(Router.RouteHandler)
Route = React.createFactory(Router.Route)
DefaultRoute = React.createFactory(Router.DefaultRoute)
NotFoundRoute = React.createFactory(Router.NotFoundRoute)

Dummy = React.createClass
  displayName: 'DummyWrapper'
  render: ->
    RouteHandler()


createReactRouterRoutes = (rootRoute) ->

  _key = 0

  composeRoutes = (route) ->
    handler = route.handler || Dummy

    childRoutes = []

    if route.defaultRouteHandler
      childRoutes.push(DefaultRoute handler: route.defaultRouteHandler, name: route.defaultRouteName, key: _key++)

    if route.notFoundRouteHandler
      childRoutes.push(NotFoundRoute handler: route.notFoundRouteHandler, key: _key++, name: 'notFound')

    if route.childRoutes
      route.childRoutes.forEach((childRoute) ->
        childRoutes.push(composeRoutes(childRoute))
      )

    Route {handler: handler, name: route.name, path: route.path, key: _key++}, childRoutes

  composeRoutes(rootRoute)


module.exports = createReactRouterRoutes