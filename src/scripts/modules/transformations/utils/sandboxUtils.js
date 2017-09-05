import {List, Map} from 'immutable';

const _decamelizeTableInput = (table) => {
  return table.reduce((memo, value, key) => {
    const newKey = key.replace(/[A-Z]/g, (match) =>  '_' + match.toLowerCase());
    return memo.set(newKey, value);
  }, Map());
};

const normalizeDockerInputMapping = (table) => {
  const allowedKeys = ['source', 'destination', 'columns', 'days', 'where_column', 'where_operator', 'where_values', 'limit'];
  return table.filter((value, key) => allowedKeys.includes(key));
};

export const hasSandbox = (backend, type) => {
  const mysqlSandbox = backend === 'mysql' && type === 'simple';
  const dockerSandbox = backend === 'docker' && ['python', 'r'].includes(type);
  const otherSandbox = ['redshift', 'snowflake'].includes(backend);
  return mysqlSandbox || dockerSandbox || otherSandbox;
};

export const generateRunParameters = (transformation, bucketId) => {
  const backend = transformation.get('backend');
  const transformationId = transformation.get('id');
  const transformationType = transformation.get('type');
  const nonDockerParams = Map({
    configBucketId: bucketId,
    transformations: [transformationId]
  });
  const tags = transformation.get('tags');
  let dockerParams = Map({
    type: transformationType === 'python' ? 'jupyter' : 'rstudio',
    packages: transformation.get('packages'),
    script: transformation.get('queriesString'),
    input: Map({
      tables: transformation.get('input')
        .map(_decamelizeTableInput)
        .map(normalizeDockerInputMapping)
    })
  });
  if (tags && tags.count() > 0) {
    dockerParams = dockerParams.setIn(['input', 'files'], List([{tags: tags}]));
    dockerParams = dockerParams.set('tags', tags);
  }
  return backend === 'docker' ? dockerParams : nonDockerParams;
};
