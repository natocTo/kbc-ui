import createRoute from '../configurations/utils/createRoute';
import columnTypes from '../configurations/utils/columnTypeConstants';
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
import {CollapsibleSection} from '../configurations/utils/renderHelpers';

const routeSettings = {
  componentId: 'htns.ex-salesforce',
  componentType: 'extractor',
  index: {
    sections: [{
      render: CollapsibleSection({
        title: 'Salesforce Credentials',
        contentComponent: CredentialsForm,
        options: {includeSaveButtons: true}
      }),
      onSave: credentialsCreateConfiguration,
      onLoad: credentialsParseConfiguration,
      isComplete: credentialsIsComplete
    }]
  },
  row: {
    hasState: true,
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
        type: columnTypes.TABLE_LINK_DEFAULT_BUCKET,
        value: function(row) {
          return row.getIn(['configuration', 'parameters', 'objects', 0, 'name']);
        }
      }
    ]
  }
};

export default createRoute(routeSettings);
