componentsWithSshTunnel = [
  'keboola.wr-redshift-v2'
  'keboola.wr-db-mssql-v2'
  'keboola.wr-db-mysql'
  'keboola.wr-db-impala'
  'keboola.wr-db-oracle'
  'keboola.wr-db-snowflake'
  'keboola.wr-db-pgsql'
]

module.exports = (componentId) ->
  componentId in componentsWithSshTunnel
