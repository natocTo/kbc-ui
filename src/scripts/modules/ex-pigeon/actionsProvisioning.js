import callDockerAction from '../components/DockerActionsApi';

const COMPONENT_ID = 'keboola.ex-pigeon';

export default function() {

  return {
    requestEmail() {
      return callDockerAction(COMPONENT_ID, 'get', '{"configData": {"parameters": {"config": "test"}}}');
    }
  };
}