import React from 'react';
import ComponentDetailLink from './ComponentDetailLink';
import ComponentBadge from './ComponentBadge';
import ComponentIcon from './ComponentIcon';


export default React.createClass({
  propTypes: {
    component: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate(nextProps) {
    this.props.component === nextProps.component;
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
            filterBadge="3rdParty"
            type="plain"/>
        <ComponentIcon
            component={component}
            size="64"
        />
        <h2>
            {component.get('name')}
        </h2>
        <p className="kbc-components-overview-description">
            {component.get('description')}
        </p>
      </ComponentDetailLink>
    );
  }


});
