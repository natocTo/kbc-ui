import VersionsActionCreators from '../RowVersionsActionCreators';
import InstalledComponentsActionCreators from '../../components/InstalledComponentsActionCreators';

export default function(componentId, configId, rowId, versionId) {
  return function() {
    var reloadCallback = function(component, config) {
      var promises = [];
      promises.push(InstalledComponentsActionCreators.loadComponentConfigData(component, config));
      return promises;
    };
    VersionsActionCreators.rollbackVersion(componentId, configId, rowId, versionId, reloadCallback);
  };
}
