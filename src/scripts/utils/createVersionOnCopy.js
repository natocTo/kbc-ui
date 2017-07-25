import VersionsActionCreators from '../modules/components/VersionsActionCreators';
import InstalledComponentsActionCreators from '../modules/components/InstalledComponentsActionCreators';

export default function(componentId, configId, version, name) {
  return function() {
    var reloadCallback = function() {
      var promises = [];
      promises.push(InstalledComponentsActionCreators.loadComponentsForce());
      return promises;
    };
    VersionsActionCreators.copyVersion(componentId, configId, version, name, reloadCallback);
  };
}
