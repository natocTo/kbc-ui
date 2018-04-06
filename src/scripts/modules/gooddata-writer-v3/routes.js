import { columnTypes, createRoute }  from '../configurations/utils/createRoute';
import TitleSection from './react/components/TitleSection';
import title from './adapters/title';
import rowAdapter from './adapters/row';

import DimensionsSection from './react/components/DimensionsSection';
import dimensionsAdapter from './adapters/dimensions';

import {Map} from 'immutable';
import React from 'react';

const routeSettings = {
  componentId: 'keboola.gooddata-writer',
  componentType: 'writer',
  credentials: {
    show: true,
    detail: {
      title: 'Dimensions',
      render: DimensionsSection,
      onSave: dimensionsAdapter.createConfiguration,
      onLoad: dimensionsAdapter.parseConfiguration,
      isComplete: () => true
    }
  },
  row: {
    hasState: true,
    onSave: rowAdapter.createConfiguration, // defualt merge through all sections onSave functions
    onLoad: rowAdapter.parseConfiguration, // if not set then merge through all sections onLoad funtions
    onCreate: rowAdapter.createEmptyConfiguration,
    sections: [
      {
        title: 'Title and Identifier',
        render: TitleSection,
        onSave: title.createConfiguration,
        onLoad: title.parseConfiguration,
        isComplete: () => true
      }
    ],
    // detail obsolete - will be removed
    detail: {
      title: 'Title and Identifier',
      render: TitleSection,
      onSave: title.createConfiguration,
      onLoad: title.parseConfiguration,
      onCreate: title.createEmptyConfiguration,
      isComplete: () => true
    },
    columns: [
      {
        name: 'Table Name',
        type: columnTypes.VALUE,
        value: function(row) {
          return row.get('name') !== '' ? row.get('name') : 'Untitled';
        }
      },
      {
        name: 'GoodData Title',
        type: columnTypes.VALUE,
        value: function(row) {
          const params = row.getIn(['configuration', 'parameters'], Map());
          const tableId = params.keySeq().first();
          return params.getIn([tableId, 'title']);
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
