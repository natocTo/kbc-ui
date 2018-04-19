import React, {PropTypes} from 'react';
import StringUtils from '../../../utils/string';
import ComponentDetailLink from '../../../react/common/ComponentDetailLink';
import Immutable from 'immutable';
import {AlertBlock} from '@keboola/indigo-ui';

import './expiration.less';

export default React.createClass({
  propTypes: {
    components: PropTypes.object
  },

  render() {
    const deprecatedComponents = this.props.components.filter(function(component) {
      return !!component.get('flags', Immutable.List()).contains('deprecated');
    });

    if (deprecatedComponents.isEmpty()) {
      return null;
    }

    const grouped = deprecatedComponents.groupBy(function(component) {
      return component.get('type');
    });

    return (
      <AlertBlock style="warning" title="Project contains deprecated components">
        <div className="row">
          {grouped.entrySeq().map(function([type, components]) {
            return (
            <div className="col-md-6" key={type}>
              <h4>
                <span className={'kbc-' + type + '-icon'}/>
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
                      {component.get('name')}
                      </ComponentDetailLink>
                  </li>
                );
              })}
              </ul>
          </div>
            );
          })}
        </div>
      </AlertBlock>
    );
  }
});
