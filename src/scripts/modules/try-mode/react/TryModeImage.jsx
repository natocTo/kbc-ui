import React from 'react';
import {Image} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    imgageName: React.PropTypes.string
  },
  render() {
    return (
       <span>
         <Image className="center-block" responsive src={require('../media/' + this.props.imgageName)}/>
       </span>
    );
  }
});