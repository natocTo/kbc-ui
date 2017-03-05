import Index from './react/pages/TrashIndex';
import installedComponentsActions from '../components/InstalledComponentsActionCreators';
import TrashHeaderButtons from './react/components/TrashHeaderButtons';
import ComponentReloaderButton from '../components/react/components/ComponentsReloaderButton';

// import store from './storeProvisioning';
// import DeletedComponentsStore from '../components/stores/DeletedComponentsStore';

export default {
  name: 'settings-trash',
  title: 'Trash',
  path: 'settings-trash',
  isComponent: true,
  defaultRouteHandler: Index,
  headerButtonsHandler: TrashHeaderButtons,
  reloaderHandler: ComponentReloaderButton,
  requireData: [
    () => installedComponentsActions.loadComponents()
  ],
  // @FIXME poll deleted components
  // poll: {
  //   interval: 7,
  //   action: (params) => jobsActionCreators.loadComponentConfigurationLatestJobs(COMPONENT_ID, params.config)
  // },
  childRoutes: [
  ]
};
