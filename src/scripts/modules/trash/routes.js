import Index from './react/pages/TrashIndex';
import installedComponentsActions from '../components/InstalledComponentsActionCreators';
import ComponentReloaderButton from '../components/react/components/ComponentsReloaderButton';

// import store from './storeProvisioning';
export default {
  name: 'settings-trash',
  title: 'Trash',
  path: 'settings-trash',
  isComponent: true,
  defaultRouteHandler: Index,
  reloaderHandler: ComponentReloaderButton,
  requireData: [
    () => installedComponentsActions.loadComponents()
  ],
  poll: {
    interval: 10,
    action: () => installedComponentsActions.loadDeletedComponentsForce()
  },
  childRoutes: [
  ]
};
