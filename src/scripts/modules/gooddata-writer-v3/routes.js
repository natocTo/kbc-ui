import { columnTypes, createRoute }  from '../configurations/utils/createRoute';
import TitleSection from './react/components/TitleSection';
import title from './adapters/title';

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
      onSave: dimensionsAdapter.createConfiguratio,
      onLoad: dimensionsAdapter.parseConfiguration,
      isComplete: true
    }
  },
  row: {
    hasState: true,
    detail: {
      title: 'Title and Identifier',
      render: TitleSection,
      onSave: title.createConfiguration,
      onLoad: title.parseConfiguration,
      onCreate: title.createEmptyConfiguration,
      isComplete: true
    },
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
          const params = row.getIn(['configuration', 'params'], Map());
          return params.keySeq().first();
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
