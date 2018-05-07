import React, {PropTypes} from 'react';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ComponentsStore from '../../stores/ComponentsStore';
import NewComponentSelection from '../components/NewComponentSelection';

export default React.createClass({
  mixins: [createStoreMixin(ComponentsStore)],
  propTypes: {
    type: PropTypes.string.isRequired
  },

  getStateFromStores() {
    const components = ComponentsStore
      .getFilteredForType(this.props.type)
      .filter((component) => {
        return !component.get('flags').includes('excludeFromNewList');
      });

    return {
      components: components,
      componentFilter: ComponentsStore.getComponentFilter(this.props.type)
    };
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStores());
  },

  render() {
    return (
        <div className="container-fluid">
          <NewComponentSelection
            className="kbc-main-content"
            components={this.state.components}
            componentFilter={this.state.componentFilter}
            componentType={this.props.type}
            />
        </div>
    );
  }

});