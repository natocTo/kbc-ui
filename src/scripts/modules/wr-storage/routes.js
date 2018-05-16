import {Map} from 'immutable';
import React from 'react';

import createRoute  from '../configurations/utils/createRoute';
import columnTypes  from '../configurations/utils/columnTypeConstants';
import {CollapsibleSection} from '../configurations/utils/renderHelpers';

import InputMappingSection from './react/components/InputMapping';
import inputMappingAdapter from './adapters/inputMapping';

import TargetProjectSection from './react/components/TargetProject';
import targetProjectAdapter from './adapters/targetProject';


const routeSettings = {
  componentId: 'keboola.wr-storage',
  componentType: 'writer',
  index: {
    sections: [
      {
        render: CollapsibleSection({
          title: 'Target Project',
          contentComponent: TargetProjectSection,
          options: { includeSaveButtons: true }
        }),
        onSave: targetProjectAdapter.createConfiguration,
        onLoad: targetProjectAdapter.parseConfiguration
      }
    ]
  },
  row: {
    hasState: false,
    // onSave: rowAdapter.createConfiguration, // default merge through all sections onSave functions
    // onLoad: rowAdapter.parseConfiguration, // if not set then merge through all sections onLoad funtions
    // onCreate: rowAdapter.createEmptyConfiguration,
    sections: [
      {
        render: InputMappingSection,
        onSave: inputMappingAdapter.createConfiguration,
        onLoad: inputMappingAdapter.parseConfiguration,
        onCreate: inputMappingAdapter.createEmptyLocalState,
        table: (configuration) => configuration.getIn(['storage', 'input', 'tables', 0, 'source'])
      }

    ],
    columns: [
      {
        name: 'Name',
        type: columnTypes.VALUE,
        value: function(row) {
          return row.get('name') !== '' ? row.get('name') : 'Untitled';
        }
      },
      {
        name: 'Source Table',
        type: columnTypes.VALUE,
        value: function(row) {
          const configuration = row.getIn(['configuration'], Map());
          return configuration.getIn(['storage', 'input', 'tables', 0, 'source'], 'Unknown');
        }
      },
      {
        name: 'Destination Table',
        type: columnTypes.VALUE,
        value: function(row) {
          const configuration = row.getIn(['configuration'], Map());
          return configuration.getIn(['storage', 'input', 'tables', 0, 'destination'], 'Unknown');
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

const result = createRoute(routeSettings);

export default result;
