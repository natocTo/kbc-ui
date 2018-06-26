import React, {PropTypes} from 'react';
import StringUtils from '../../../utils/string';
import ComponentDetailLink from '../../../react/common/ComponentDetailLink';
import ComponentName from '../../../react/common/ComponentName';
import Immutable from 'immutable';
import {AlertBlock, Icon} from '@keboola/indigo-ui';


export default React.createClass({
  propTypes: {
    components: PropTypes.object
  },
  render() {
    var getOddComponentList = function() {
      return (getFilteredComponentList(1));
    };
    var getEvenComponentList = function() {
      return (getFilteredComponentList(0));
    };
    var getFilteredComponentList = function(even) {
      let idx = 0;
      return (grouped.entrySeq().map(function([type, components]) {
        idx++;
        if (idx % 2 === even) {
          return (getComponentList(components, type));
        }
      }));
    };
    const deprecatedComponents = this.props.components.filter(function(component) {
      return !!component.get('flags', Immutable.List()).contains('deprecated');
    });

    if (deprecatedComponents.isEmpty()) {
      return null;
    }

    const grouped = deprecatedComponents.groupBy(function(component) {
      return component.get('type');
    });
    let getComponentList = function(components, type) {
      let ComponentIcon = Icon[StringUtils.capitalize(type)];

      return (
        <div key={type}>
          <h4>
            <ComponentIcon className="icon-category"/>
            {StringUtils.capitalize(type)}s
          </h4>
          <ul className="list-unstyled">
            {components.entrySeq().map(function([index, component]) {
              return (
                <li key={index}>
                  <ComponentDetailLink
                    type={component.get('type')}
                    componentId={component.get('id')}
                  >
                    <ComponentName component={component}/>
                  </ComponentDetailLink>
                </li>
              );
            })}
          </ul>
        </div>
      );
    };
    return (
      <AlertBlock type="warning" title="Project contains deprecated components">
         <div className="row">
          <div className="col-md-6">
            {getOddComponentList()}
          </div>
          <div className="col-md-6">
            {getEvenComponentList()}
          </div>
        </div>
      </AlertBlock>
    );
  }
});
