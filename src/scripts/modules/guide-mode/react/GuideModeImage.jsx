import React from 'react';
import {Image} from 'react-bootstrap';
import ApplicationStore from '../../../stores/ApplicationStore';

export default React.createClass({
  propTypes: {
    imgageName: React.PropTypes.string
  },
  getImagePath() {
    return ApplicationStore.getScriptsBasePath() + require('../media/' + this.props.imgageName);
  },
  render() {
    return (
        <span>
         <Image className="center-block" responsive
                src={this.getImagePath()}/>
       </span>
    );
  }
});