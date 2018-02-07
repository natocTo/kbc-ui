import route from '../../utils/configRowsRoute';
import {
  createConfiguration as rowCreateConfiguration,
  parseConfiguration as rowParseConfiguration,
  isCompleted as rowIsCompleted,
  createEmptyConfiguration as rowCreateEmptyConfiguration
} from './adapters/row';
import {
  createConfiguration as credentialsCreateConfiguration,
  parseConfiguration as credentialsParseConfiguration,
  isCompleted as credentialsIsCompleted
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
      isCompleted: credentialsIsCompleted
    }
  },
  row: {
    hasState: true,
    detail: {
      render: ConfigurationForm,
      onSave: rowCreateConfiguration,
      onCreate: rowCreateEmptyConfiguration,
      onLoad: rowParseConfiguration,
      isCompleted: rowIsCompleted
    }
  }
};

export default route(routeSettings);
