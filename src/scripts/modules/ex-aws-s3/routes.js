import route from '../../utils/configRowsRoute';
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

const routeSettings = {
  componentId: 'keboola.ex-aws-s3',
  componentType: 'extractor',
  credentials: {
    detail: {
      title: 'AWS Credentials',
      render: CredentialsForm,
      onSave: credentialsCreateConfiguration,
      onLoad: credentialsParseConfiguration,
      isComplete: credentialsIsComplete
    }
  },
  row: {
    hasState: true,
    detail: {
      render: ConfigurationForm,
      onSave: rowCreateConfiguration,
      onCreate: rowCreateEmptyConfiguration,
      onLoad: rowParseConfiguration
    }
  }
};

export default route(routeSettings);
