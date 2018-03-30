import Immutable, {Map} from 'immutable';
const createConfiguration = (localState) => {
  const tableId = localState.get('tableId');
  const title = localState.get('title');
  const identifier = localState.get('identifier');
  const params = {[tableId]: {title, identifier}};
  return Immutable.fromJS({
    parameters: params
  });
};

export default {
  createConfiguration,
  parseConfiguration(configuration) {
    const params = configuration.get('parameters', Map());
    const tableId = params.keySeq().first();
    const tableParams = params.get(tableId, Map());
    return Map({
      tableId: tableId,
      title: tableParams.get('title'),
      identifier: tableParams.get('identifier')
    });
  },

  createEmptyConfiguration(name, webalizedName) {
    const initState = {
      tableId: name,
      title: webalizedName,
      identifier: ''
    };
    return createConfiguration(Immutable.fromJS(initState));
  }
};
