const COMPONENTS_DATATYPES = {
  'keboola.wr-db-snowflake': {
    default: {
      type: 'string',
      size: '255'
    }
  },
  'keboola.wr-db-oracle': {
    default: {
      type: 'varchar2',
      size: '255'
    }
  },
  'keboola.wr-db-impala': {
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'keboola.wr-db-mssql-v2': {
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'keboola.wr-db-pgsql': {
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'keboola.wr-redshift-v2': {
    default: {
      type: 'VARCHAR',
      size: '255'
    }
  },
  'keboola.wr-db-mysql': {
    default: {
      type: 'TEXT'
    }
  }
};

export default function(componentId) {
  const datatypes = COMPONENTS_DATATYPES[componentId];

  return {
    getDefaultDataType() {
      return datatypes.default;
    }
  };
}