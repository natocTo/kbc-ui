import React from 'react';

import ComponentDetailLink from './ComponentDetailLink';
import ComponentBadge from './ComponentBadge';
import ComponentIcon from './ComponentIcon';
import ComponentName from './ComponentName';

export default React.createClass({
  propTypes: {
    component: React.PropTypes.object.isRequired
  },

  render() {
    const component = this.props.component;
    return (
      <ComponentDetailLink
          componentId={component.get('id')}
          type={component.get('type')}
      >
        <ComponentBadge
            component={component}
            filterBadges={['3rdParty', 'appInfo.beta']}
            type="plain"
        />
        <ComponentIcon
            component={component}
            size="64"
        />
        <h2>
            <ComponentName component={component} />
        </h2>
        <p className="kbc-components-overview-description">
            {component.get('description')}
        </p>
      </ComponentDetailLink>
    );
  }
});
