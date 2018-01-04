import React from 'react';

import route from '../../utils/configRowsRoute';
import { createConfiguration as rowCreateConfiguration, parseConfiguration as rowParseConfiguration } from './adapters/row';
import { createConfiguration as credentialsCreateConfiguration, parseConfiguration as credentialsParseConfiguration } from './adapters/credentials';
import ConfigurationForm from './react/components/Configuration';
import CredentialsForm from './react/components/Credentials';
import fuzzy from 'fuzzy';

const routeSettings = {
  componentId: 'keboola.ex-aws-s3',
  hasCredentials: true,
  credentialsTitle: 'AWS Credentials',
  rowItem: {
    singular: 'Table',
    plural: 'Tables'
  },
  adapters: {
    credentials: {
      create: credentialsCreateConfiguration,
      parse: credentialsParseConfiguration
    },
    row: {
      create: rowCreateConfiguration,
      parse: rowParseConfiguration
    }
  },
  components: {
    row: ConfigurationForm,
    credentials: CredentialsForm
  },
  list: {
    header: ['Name', 'Description'],
    columns: [
      function(row) {
        return row.get('name') !== '' ? row.get('name') : 'Untitled';
      },
      function(row) {
        return (
          <small>
            {row.get('description') !== '' ? row.get('description') : 'No description'}
          </small>
        );
      }
    ],
    filter: function(row, query) {
      return fuzzy.test(query, row.get('name')) || fuzzy.test(query, row.get('description'));
    }
  }
};

export default route(routeSettings);
