import Immutable from 'immutable';

const addBackendMap = function(dataToAppendTo, backend) {
  let data = Immutable.fromJS(dataToAppendTo);
  if (backend === null) {
    return data.toJS();
  }
  switch (backend) {
    case 'mysql':
      data = data.set('backend', 'mysql').set('type', 'simple');
      break;
    case 'redshift':
      data = data.set('backend', 'redshift').set('type', 'simple');
      break;
    case 'snowflake':
      data = data.set('backend', 'snowflake').set('type', 'simple');
      break;
    case 'r':
      data = data.set('backend', 'docker').set('type', 'r');
      break;
    case 'python':
      data = data.set('backend', 'docker').set('type', 'python');
      break;
    case 'openrefine':
      data = data.set('backend', 'docker').set('type', 'openrefine');
      break;
    default:
      throw new Error('Unknown backend ' + backend);
  }
  return data.toJS();
};

const backendOptions = function(token) {
  var options = [];
  options.push({value: 'mysql', label: 'MySQL'});
  if (token.getIn(['owner', 'hasRedshift'], false)) {
    options.push({value: 'redshift', label: 'Redshift'});
  }
  if (token.getIn(['owner', 'hasSnowflake'], false)) {
    options.push({value: 'snowflake', label: 'Snowflake'});
  }
  options.push({value: 'r', label: 'R'});
  options.push({value: 'python', label: 'Python'});
  options.push({value: 'openrefine', label: 'OpenRefine (beta)'});
  return options;
};

module.exports = {
  backendOptions: backendOptions,
  addBackendMap: addBackendMap
};
