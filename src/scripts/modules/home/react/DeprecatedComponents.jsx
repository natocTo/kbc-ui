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
  getOddComponentList() {
    return (this.getFilteredComponentList(1));
  },
  getEvenComponentList() {
    return (this.getFilteredComponentList(0));
  },
  getDeprecatedComponents() {
    return this.props.components.filter(function(component) {
      return !!component.get('flags', Immutable.List()).contains('deprecated');
    });
  },
  getGrouped() {
    return this.getDeprecatedComponents().groupBy(function(component) {
      return component.get('type');
    });
  },
  getFilteredComponentList(even) {
    let idx = 0;
    return this.getGrouped().entrySeq().map(function([type, components]) {
      idx++;
      if (idx % 2 === even) {
        return (
          <div key={type}>
            <h4>
              {React.createElement(Icon[StringUtils.capitalize(type)], {className: 'icon-category'})}
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
      }
    });
  },
  render() {
    if (this.getDeprecatedComponents().isEmpty()) {
      return null;
    }
    return (
      <AlertBlock type="warning" title="Project contains deprecated components">
        <div className="row">
          <div className="col-md-6">
            {this.getOddComponentList()}
          </div>
          <div className="col-md-6">
            {this.getEvenComponentList()}
          </div>
        </div>
      </AlertBlock>
    );
  }
});