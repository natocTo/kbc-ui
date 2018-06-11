import createVersionsPage from '../react/pages/Versions';

export default function(componentId, configId, routeUniqueName, options = {readOnlyMode: false}) {
  return {
    name: routeUniqueName || `${componentId}-versions`,
    path: 'versions',
    title: 'Versions',
    defaultRouteHandler: createVersionsPage(componentId, configId, (options && options.readOnlyMode))
  };
}
