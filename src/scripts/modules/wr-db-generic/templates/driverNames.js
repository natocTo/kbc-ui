const drivers = {
  mysql: 'MySQL',
  redshift: 'Redshift',
  snowflake: 'Snowflake'
};

export default function(componentId) {
  return drivers[componentId];
}
