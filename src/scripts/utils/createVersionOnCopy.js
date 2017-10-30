import VersionsActionCreators from '../modules/components/VersionsActionCreators';
import InstalledComponentsActionCreators from '../modules/components/InstalledComponentsActionCreators';

export default function(componentId, configId, version, name) {
  return function() {
    var reloadCallback = function(component) {
      var promises = [];
      if (componentId === 'transformation') {
        promises.push(InstalledComponentsActionCreators.loadComponentConfigsData(component));
      }
      promises.push(InstalledComponentsActionCreators.loadComponentsForce());
      return promises;
    };
    VersionsActionCreators.copyVersion(componentId, configId, version, name, reloadCallback);
  };
}
