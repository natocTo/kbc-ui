import React from 'react';
import {Link} from 'react-router';
import {Routes} from '../../Constants';
import RoutesStore from '../../../../stores/RoutesStore';
import ComponentsStore from '../../stores/ComponentsStore';
const {GENERIC_DETAIL_PREFIX} = Routes;

export default React.createClass({

  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    message: React.PropTypes.string,
    linkLabel: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      message: 'Configuration copied',
      linkLabel: 'go to the new configuration'
    };
  },

  render() {
    return (
      <span>
        {this.props.message},
        {' '}{this.renderLink()}.
      </span>
    );
  },

  renderLink() {
    const {componentId, configId, linkLabel} = this.props;
    // transformation component
    if (componentId === 'transformation') {
      return (
        <Link
          to="transformationBucket"
          params={{config: configId}}
        >
          {linkLabel.replace(/ /g, '\u00a0')}
        </Link>
      );
    }
    // typical component route
    if (RoutesStore.hasRoute(componentId)) {
      return (
        <Link
          to={componentId}
          params={{config: configId}}
        >
          {linkLabel.replace(/ /g, '\u00a0')}
        </Link>

      );
    }
    const components = ComponentsStore.getAll();
    // generic component route
    return (
      <Link
        to={GENERIC_DETAIL_PREFIX + components.getIn([componentId, 'type']) + '-config'}
        params={{component: componentId, config: configId}}
      >
        {linkLabel.replace(/ /g, '\u00a0')}
      </Link>
    );
  }
});
