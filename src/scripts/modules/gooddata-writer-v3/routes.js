import { columnTypes, createRoute }  from '../configurations/utils/createRoute';
import createColumnsEditorSection from '../configurations/utils/createColumnsEditorSection';
import TitleSection from './react/components/TitleSection';
import LoadTypeSection from './react/components/LoadTypeSection';
import title from './adapters/title';
import loadType from './adapters/loadType';
import rowAdapter from './adapters/row';

import DimensionsSection from './react/components/DimensionsSection';
import dimensionsAdapter from './adapters/dimensions';


import TitleColumnInput from './react/components/TitleColumnInput';
import TypeColumn from './react/components/TypeColumn';

import {Map} from 'immutable';
import React from 'react';

const routeSettings = {
  componentId: 'keboola.gooddata-writer',
  componentType: 'writer',
  index: {
    show: true,
    sections: [
      {
        render: DimensionsSection,
        onSave: dimensionsAdapter.createConfiguration,
        onLoad: dimensionsAdapter.parseConfiguration,
        isComplete: () => true
      }
    ]
  },
  row: {
    hasState: false,
    onSave: rowAdapter.createConfiguration, // defualt merge through all sections onSave functions
    onLoad: rowAdapter.parseConfiguration, // if not set then merge through all sections onLoad funtions
    onCreate: rowAdapter.createEmptyConfiguration,
    sections: [
      {
        render: TitleSection,
        onSave: title.createConfiguration,
        onLoad: title.parseConfiguration,
        onCreate: title.createEmptyConfiguration,
        isComplete: () => true
      },
      {
        render: LoadTypeSection,
        onSave: loadType.createConfiguration,
        onLoad: loadType.parseConfiguration,
        onCreate: loadType.createEmptyConfiguration,
        isComplete: () => true
      },
      createColumnsEditorSection({
        initColumnFn: columnName => Map({id: columnName, type: 'IGNORE', title: columnName}),
        columnsKey: 'columns',
        matchColumnKey: 'id',
        isColumnIgnored: column => column.get('type') === 'IGNORE',
        onSaveColumns: (columnsList) =>
          columnsList.reduce((memo, column) =>
            memo.set(column.get('id'), column.delete('id')), Map()),
        onLoadColumns: (configColumns) =>
          (configColumns || Map())
            .map((column, id) => column.set('id', id))
            .valueSeq().toList(),
        columnsMappings: [
          {
            title: 'GoodData Title',
            render: TitleColumnInput
          },
          {
            title: 'Type',
            render: TypeColumn
          }
        ],
        isComplete: () => true
      })
    ],
    // detail obsolete - will be removed
    detail: {
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
