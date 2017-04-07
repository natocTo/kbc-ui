/* defulat defined in .../wr-db/react/pages/table.coffee
defaultDataTypes =
  ['INT','BIGINT',
    'VARCHAR': {defaultSize: '255'},
    'TEXT',
    'DECIMAL': {defaultSize: '12,2'},
    'DATE', 'DATETIME'
  ]
*/
var impala, mssql, mysql, oracle, oracleold, pgsql, redshift, snowflake;

mysql = ['BIGINT',
  {
    'TEXT': {
      basetype: 'STRING'
    }
  },
  {
    'INT': {
      basetype: 'INGTEGER'
    }
  },
  {
    'VARCHAR': {
      defaultSize: '255'
    }
  },
  {
    'DECIMAL': {
      defaultSize: '12,2',
      basetype: 'NUMERIC'
    }
  }, {
    'DATE': {
      basetype: 'DATE'
    }
  }, {
    'DATETIME': {
      basetype: 'TIMESTAMP'
    }
  }
];

redshift = [
  'SMALLINT', 'BIGINT', 'DOUBLE PRECISION',
  {
    'INTEGER': {
      basetype: 'INTEGER'
    }
  }, {
    'DECIMAL': {
      defaultSize: '12,2',
      basetype: 'NUMERIC'
    }
  }, {
    'REAL': {
      basetype: 'FLOAT'
    }
  }, {
    'CHAR': {
      defaultSize: '255'
    }
  }, {
    'BOOLEAN': {
      basetype: 'BOOLEAN'
    }
  }, {
    'VARCHAR': {
      defaultSize: '255',
      basetype: 'STRING'
    }
  }, {
    'DATE': {
      basetype: 'DATE'
    }
  }, {
    'TIMESTAMP': {
      basetype: 'TIMESTAMP'
    }
  }
];

mssql = ['bigint', 'money', 'real', 'smalldatetime', 'datetime2', 'timestamp', 'text', 'smallint', 'ntext', 'image',
  {
    'uniqueidentifier': {
      defaultSize: '36'
    }
  }, {
    'decimal': {
      defaultSize: '12,2',
      basetype: 'NUMERIC'
    }
  }, {
    'float': {
      defaultSize: '12',
      basetype: 'FLOAT'
    }
  }, {
    'date': {
      basetype: 'DATE'
    }
  }, {
    'datetime': {
      basetype: 'TIMESTAMP'
    }
  }, {
    'time': {
      defaultSize: '7'
    }
  }, {
    'char': {
      defaultSize: '255'
    }
  }, {
    'varchar': {
      defaultSize: '255',
      basetype: 'STRING'
    }
  }, {
    'nchar': {
      defaultSize: '255'
    }
  }, {
    'int': {
      basetype: 'INTEGER'
    }
  }, {
    'nvarchar': {
      defaultSize: '255'
    }
  }, {
    'binary': {
      defaultSize: '1',
      basetype: 'BOOLEAN'
    }
  }, {
    'varbinary': {
      defaultSize: '1'
    }
  }
];

impala = ['bigint', 'double', 'real', 'smallint', 'tinyint',
  {
    'boolean': {
      basetype: 'BOOLEAN'
    }
  }, {
    'char': {
      defaultSize: '255'
    }
  }, {
    'decimal': {
      defaultSize: '9,0',
      basetype: 'NUMERIC'
    }
  }, {
    'float': {
      basetype: 'FLOAT'
    }
  }, {
    'int': {
      basetype: 'INTEGER'
    }
  }, {
    'string': {
      basetype: 'STRING'
    }
  }, {
    'timestamp': {
      basetype: 'TIMESTAMP'
    }
  }, {
    'varchar': {
      defaultSize: '255',
      basetype: 'DATE'
    }
  }
];

oracleold = [
  'char', 'nchar', 'varchar2', 'nvarchar', 'blob', 'clob', 'nclob', 'bfile',
  'number', 'binary_float', 'binary_double', 'raw', 'rowid', 'urowid',
  {
    'decimal': {
      basetype: 'NUMERIC'
    }
  }, {
    'float': {
      basetype: 'FLOAT'
    }
  }, {
    'integer': {
      basetype: 'INTEGER'
    }
  }, {
    'date': {
      basetype: 'DATE'
    }
  }, {
    'timestamp': {
      basetype: 'TIMESTAMP'
    }
  }
];

oracle = ['bfile', 'binary_float', 'binary_double', 'blob', 'clob', 'nclob', 'rowid', 'urowid',
  {
    'char': {
      defaultSize: '255'
    }
  }, {
    'date': {
      basetype: 'DATE'
    }
  }, {
    'nchar': {
      defaultSize: '255'
    }
  }, {
    'nvarchar2': {
      defaultSize: '255'
    }
  }, {
    'number': {
      defaultSize: '12,2',
      basetype: 'NUMERIC'
    }
  }, {
    'raw': {
      defaultSize: '255'
    }
  }, {
    'timestamp': {
      basetype: 'TIMESTAMP'
    }
  }, {
    'varchar2': {
      defaultSize: '255',
      basetype: 'STRING'
    }
  }
];

snowflake = [
  'float4', 'float8', 'double', 'double precision', 'real', 'int', 'bigint', 'smallint', 'tinyint', 'byteint',
  'timestamp_ltz', 'timestamp_ntz', 'timestamp_tz',
  {
    'number': {
      defaultSize: '38,0',
      basetype: 'NUMERIC'
    }
  }, {
    'decimal': {
      defaultSize: '38,0'
    }
  }, {
    'numeric': {
      defaultSize: '38,0'
    }
  }, {
    'integer': {
      basetype: 'INTEGER'
    }
  }, {
    'float': {
      basetype: 'FLOAT'
    }
  }, {
    'boolean': {
      basetype: 'BOOLEAN'
    }
  }, {
    'char': {
      defaultSize: '255'
    }
  }, {
    'character': {
      defaultSize: '255'
    }
  }, {
    'varchar': {
      defaultSize: '255'
    }
  }, {
    'string': {
      defaultSize: '255',
      basetype: 'STRING'
    }
  }, {
    'text': {
      defaultSize: '255'
    }
  }, {
    'binary': {
      defaultSize: '255'
    }
  }, {
    'date': {
      basetype: 'DATE'
    }
  }, {
    'time': {
      defaultSize: '9'
    }
  }, {
    'timestamp': {
      basetype: 'TIMESTAMP'
    }
  }
];

pgsql = [
  'int', 'smallint', 'bigint', 'text', 'bytea', 'time', 'time with timezone', 'timestamp with timezone', 'interval',
  'double precision', 'float4', 'float8', 'serial', 'bigserial', 'smallserial', 'money', 'json', 'jsonb',
  {
    'boolean': {
      basetype: 'BOOLEAN'
    }
  }, {
    'real': {
      basetype: 'FLOAT'
    }
  },
  {
    'date': {
      basetype: 'DATE'
    }
  },
  {
    'timestamp': {
      basetype: 'TIMESTAMP'
    }
  },
  {
    'decimal': {
      defaultSize: '12,2'
    }
  }, {
    'integer': {
      basetype: 'INTEGER'
    }
  }, {
    'numeric': {
      defaultSize: '12,0',
      basetype: 'NUMERIC'
    }
  }, {
    'char': {
      defaultSize: '255'
    }
  }, {
    'character': {
      defaultSize: '255'
    }
  }, {
    'varchar': {
      defaultSize: '255',
      basetype: 'STRING'
    }
  }, {
    'character varying': {
      defaultSize: '255'
    }
  }, {
    'enum': {
      defaultSize: 'my_enum_type'
    }
  }
];

module.exports = {
  'keboola.wr-db-snowflake': {
    typesList: snowflake,
    default: {
      type: 'string',
      size: '255'
    }
  },
  'keboola.wr-db-oracle': {
    typesList: oracle,
    default: {
      type: 'varchar2',
      size: '255'
    }
  },
  'keboola.wr-db-impala': {
    typesList: impala,
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'keboola.wr-db-mssql-v2': {
    typesList: mssql,
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'keboola.wr-db-pgsql': {
    typesList: pgsql,
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'keboola.wr-redshift-v2': {
    typesList: redshift,
    default: {
      type: 'VARCHAR',
      size: '255'
    }
  },
  'wr-db-mssql': {
    typesList: mssql,
    default: {
      type: 'varchar',
      size: '255'
    }
  },
  'wr-db-redshift': {
    typesList: redshift,
    default: {
      type: 'VARCHAR',
      size: '255'
    }
  },
  'wr-db-oracle': {
    typesList: oracleold,
    default: {
      type: 'varchar2'
    }
  },
  'keboola.wr-db-mysql': {
    typesList: mysql,
    default: {
      type: 'TEXT'
    }
  }
};
