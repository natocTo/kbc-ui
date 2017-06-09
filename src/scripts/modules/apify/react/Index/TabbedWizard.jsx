import React, {PropTypes} from 'react';


export default React.createClass({

  propTypes: {
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired
  },

  render() {
    return 'blablabl';
  }


});
