import route from '../../utils/configRowsRoute';
import { createConfiguration as rowCreateConfiguration, parseConfiguration as rowParseConfiguration, isCompleted as rowIsCompleted } from './adapters/row';
import { createConfiguration as credentialsCreateConfiguration, parseConfiguration as credentialsParseConfiguration, isCompleted as credentialsIsCompleted } from './adapters/credentials';
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
    detail: {
      render: ConfigurationForm,
      onSave: rowCreateConfiguration,
      onLoad: rowParseConfiguration,
      isCompleted: rowIsCompleted
    }
  }
};

export default route(routeSettings);
