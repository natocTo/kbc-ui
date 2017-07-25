import VersionsActionCreators from '../modules/components/VersionsActionCreators';
import InstalledComponentsActionCreators from '../modules/components/InstalledComponentsActionCreators';

export default function(componentId, configId, versionId) {
  return function() {
    var reloadCallback = function(component, config) {
      var promises = [];
      promises.push(InstalledComponentsActionCreators.loadComponentConfigDataForce(component, config));
      return promises;
    };
    VersionsActionCreators.rollbackVersion(componentId, configId, versionId, reloadCallback);
  };
}
