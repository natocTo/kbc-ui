import { columnTypes, createRoute }  from '../configurations/utils/createRoute';
import {
  createConfiguration as rowCreateConfiguration,
  parseConfiguration as rowParseConfiguration,
  createEmptyConfiguration as rowCreateEmptyConfiguration
} from './adapters/row';
import {
  createConfiguration as credentialsCreateConfiguration,
  parseConfiguration as credentialsParseConfiguration,
  isComplete as credentialsIsComplete
} from './adapters/credentials';
import ConfigurationForm from './react/components/Configuration';
import CredentialsForm from './react/components/Credentials';
import React from 'react';
import Immutable from 'immutable';
import createCollapsibleSection from '../configurations/utils/createCollapsibleSection';

const routeSettings = {
  componentId: 'keboola.ex-http',
  componentType: 'extractor',
  index: {
    sections: [{
      render: createCollapsibleSection(() => <span>Base URL</span>,
                                       CredentialsForm,
                                       {includeSaveButtons: true}),
      onSave: credentialsCreateConfiguration,
      onLoad: credentialsParseConfiguration,
      isComplete: credentialsIsComplete
    }]
  },
  row: {
    sections: [{
      render: ConfigurationForm,
      onSave: rowCreateConfiguration,
      onCreate: rowCreateEmptyConfiguration,
      onLoad: rowParseConfiguration
    }],
    columns: [
      {
        name: 'Name',
        type: columnTypes.VALUE,
        value: function(row) {
          return row.get('name') !== '' ? row.get('name') : 'Untitled';
        }
      },
      {
        name: 'Storage',
        type: columnTypes.STORAGE_LINK_DEFAULT_BUCKET,
        value: function(row) {
          const processorMoveFiles = row.getIn(['configuration', 'processors', 'after'], Immutable.List()).find(function(processor) {
            return processor.getIn(['definition', 'component']) === 'keboola.processor-move-files';
          }, null, Immutable.Map());
          return processorMoveFiles.getIn(['parameters', 'folder']);
        }
      },
      {
        name: 'Description',
        type: columnTypes.VALUE,
        value: function(row) {
          return (
            <small>
              {row.get('description') !== '' ? row.get('description') : 'No description'}
            </small>
          );
        }
      }
    ]
  }
};

export default createRoute(routeSettings);
