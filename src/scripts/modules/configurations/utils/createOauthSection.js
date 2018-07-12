import {CollapsibleSection} from '../utils/renderHelpers';
import adapter from '../adapters/oauth';
import OauthSection from '../react/components/OauthSection';

export default function() {
  return {
    render: CollapsibleSection({
      title: 'Authorization',
      contentComponent: OauthSection,
      options: {
        includeSaveButtons: false
      }
    }),
    onLoad: adapter.parseConfiguration,
    onSave: adapter.createConfiguration,
    isComplete: adapter.isComplete
  };
}
