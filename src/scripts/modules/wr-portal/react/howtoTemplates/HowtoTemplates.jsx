import React, {PropTypes} from 'react';
import Remarkable from 'react-remarkable';
import sasTemplate  from './sasTemplate';

export default React.createClass({
  propTypes: {
    componentId: PropTypes.string
  },

  render() {
    const source = this.getSourceTemplate();
    return (
      <Remarkable
        source={source}
      />
    );
  },

  getSourceTemplate() {
    switch (this.props.componentId) {
      case 'wr-portal-sas':
        return sasTemplate;
      default:
        return '';
    }
  }
});
