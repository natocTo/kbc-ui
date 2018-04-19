import React, {PropTypes} from 'react';


export default React.createClass({
  propTypes: {
    onSaveConfiguration: PropTypes.func.isRequired,
    configuration: PropTypes.object
  },


  render() {
    return (
      <a className="link" onClick={()=>null}>
        Enable Access
      </a>
    );
  }

});
