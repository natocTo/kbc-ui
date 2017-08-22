export const hasSandbox = (backend, type) => {
  const mysqlSandbox = backend === 'mysql' && type === 'simple';
  const dockerSandbox = backend === 'docker' && ['python', 'r'].includes(type);
  const otherSandbox = ['redshift', 'snowflake'].includes(backend);
  return mysqlSandbox || dockerSandbox || otherSandbox;
};
