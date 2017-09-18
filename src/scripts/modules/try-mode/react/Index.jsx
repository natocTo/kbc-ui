import React from 'react';
import {Map} from 'immutable';

import actionCreators from '../../components/InstalledComponentsActionCreators';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import InstalledComponentsStore from '../../components/stores/InstalledComponentsStore';


const COMPONENT_ID = 'kbc-project-takeout',
  CONFIG_ID = '.new-tmp-config';

export default React.createClass({

  mixins: [createStoreMixin(InstalledComponentsStore)],

  getStateFromStores() {
    const defaultParameters = Map({
      awsAccessKeyId: '',
      '#awsSecretAccessKey': '',
      s3region: 'us-east-1',
      s3bucket: '',
      s3path: '',
      onlyStructure: false
    });
    return {
      parameters: InstalledComponentsStore.getEditingConfigData(COMPONENT_ID, CONFIG_ID, defaultParameters)
    };
  },

  getInitialState() {
    return {
      isSaving: false,
      jobId: null
    };
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <div className="row kbc-header">
            <div className="kbc-title">
              <span className="kb-sapi-component-icon pull-left">
                <img src="https://d3iz2gfan5zufq.cloudfront.net/images/cloud-services/cloudsearch32-1.png" />
              </span>
              <h2>Try Mode</h2>
              <p>Lessons and data samples</p>
            </div>
          </div>
          <div className="row">
            <p>
              Export this project to <a href="http://aws.amazon.com/s3/" target="_blank">AWS Simple Storage Service (S3)</a>.
            </p>
            <p>
              <strong>
                Export will contain
              </strong>
            </p>
            <ul>
              <li>All bucket and table metadata</li>
              <li>All table data exported to gzipped CSV files</li>
              <li>All component configurations</li>
            </ul>
          </div>
          <div className="row">
            <p>
              Enable try mode with lessons and data samples.
            </p>
          </div>
        </div>
      </div>
    );
  },

  handleParametersChange(newParameters) {
    actionCreators.updateEditComponentConfigData(COMPONENT_ID, CONFIG_ID, newParameters);
  }
});
