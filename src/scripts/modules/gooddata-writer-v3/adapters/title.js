import Immutable, {Map} from 'immutable';
export default {
  createConfiguration(localState) {
    const tableId = localState.get('tableId');
    const title = localState.get('title');
    const identifier = localState.get('identifier');
    const params = {[tableId]: {title, identifier}};
    return Immutable.fromJS({
      parameters: params
    });
  },

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
    return this.createConfiguration(Immutable.fromJS({name: webalizedName, parameters: {[name]: {}}}));
  }
};
