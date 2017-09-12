import React, {PropTypes} from 'react';
import StringUtils from '../../../utils/string';
// import {Link} from 'react-router';
// import ComponentIndexLink from '../../../modules/components/react/components/ComponentIndexLink';
import ComponentDetailLink from '../../../react/common/ComponentDetailLink';


import './expiration.less';

export default React.createClass({
  propTypes: {
    components: PropTypes.object
  },

  render() {
    const deprecatedComponents = this.props.components.filter(function(component) {
      return !!component.get('flags', []).contains('deprecated');
    });

    if (deprecatedComponents.isEmpty()) {
      return null;
    }

    const grouped = deprecatedComponents.groupBy(function(component) {
      return component.get('type');
    });

    return (
      <div className="row kbc-header kbc-expiration kbc-deprecation">
        <div className="alert alert-warning">
          <h3>
            Project contains deprecated components
          </h3>

            <div className="row">
          {grouped.map(function(components, type) {
            return (
              <div className="col-md-6">
                <h4>
                  <span className={'kbc-' + type + '-icon'}/>
                  {StringUtils.capitalize(type)}s
                </h4>
                <ul>
                  {components.map(function(component) {
                    return (
                      <li>
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

        </div>
      </div>
    );
  }
});