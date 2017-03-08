import ComponentsStore from '../components/stores/ComponentsStore';
import componentHasApi from '../components/utils/hasComponentApi';

export function isObsoleteComponent(componentId) {
  let component = ComponentsStore.getComponent(componentId);
  if (!component) {
    return false;
  }

  let flags = component.get('flags');

  if (componentId === 'gooddata-writer') {
    return true;
  } else if (componentId === 'transformation') {
    return false;
  } else if (
    component.get('uri') &&
    componentHasApi(componentId) &&
    !flags.includes('genericUI') &&
    !flags.includes('genericDockerUI') &&
    !flags.includes('genericTemplatesUI')
  ) {
    return true;
  } else {
    return false;
  }
}