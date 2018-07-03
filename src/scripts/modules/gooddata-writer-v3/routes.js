import createRoute  from '../configurations/utils/createRoute';
import columnTypes  from '../configurations/utils/columnTypeConstants';
import createColumnsEditorSection from '../configurations/utils/createColumnsEditorSection';
import TitleSection from './react/components/TitleSection';
import LoadTypeSection from './react/components/LoadTypeSection';
import LoadTypeSectionTitle from './react/components/LoadTypeSectionTitle';
import title from './adapters/title';
import loadType from './adapters/loadType';

import DimensionsSection from './react/components/DimensionsSection';
import dimensionsAdapter from './adapters/dimensions';
import columnsEditorDefinition from './helpers/columnsEditorDefinition';
import ToggleProjectAccess from './react/components/ToggleProjectAccess';
import {CollapsibleSection} from '../configurations/utils/renderHelpers';
import {parseParameters} from './helpers/rowParametersTable';


import {Map} from 'immutable';
// import React from 'react';

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
    parseTableId: (row) => parseParameters(row).get('tableId'),
    hasState: false,
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
          const params = row.getIn(['configuration', 'parameters', 'tables'], Map());
          const tableId = params.keySeq().first();
          return params.getIn([tableId, 'title']);
        }
      }
    ]
  }
};

const result = createRoute(routeSettings);

export default result;
