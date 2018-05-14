import { columnTypes, createRoute }  from '../configurations/utils/createRoute';
import createColumnsEditorSection from '../configurations/utils/createColumnsEditorSection';
import TitleSection from './react/components/TitleSection';
import LoadTypeSection from './react/components/LoadTypeSection';
import LoadTypeSectionTitle from './react/components/LoadTypeSectionTitle';
import title from './adapters/title';
import loadType from './adapters/loadType';
import rowAdapter from './adapters/row';

import DimensionsSection from './react/components/DimensionsSection';
import dimensionsAdapter from './adapters/dimensions';
import columnsEditorDefinition from './adapters/columnsEditorDefinition';
import ToggleProjectAccess from './react/components/ToggleProjectAccess';
import {CollapsibleSection} from '../configurations/utils/renderHelpers';

import {Map} from 'immutable';
import React from 'react';

const routeSettings = {
  componentId: 'keboola.gooddata-writer',
  componentType: 'writer',
  index: {
    sidebarCustomItems: [
      ToggleProjectAccess
    ],
    show: true,
    sections: [
      {
        render: DimensionsSection,
        onSave: dimensionsAdapter.createConfiguration,
        onLoad: dimensionsAdapter.parseConfiguration
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
        render: CollapsibleSection({
          title: LoadTypeSectionTitle,
          contentComponent: LoadTypeSection
        }),
        onSave: loadType.createConfiguration,
        onLoad: loadType.parseConfiguration,
        onCreate: loadType.createEmptyConfiguration,
        isComplete: () => true
      },
      createColumnsEditorSection(columnsEditorDefinition)
    ],
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
