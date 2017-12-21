import React from 'react';
import {Image} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    scriptsBasePath: React.PropTypes.string.isRequired,
    imageName: React.PropTypes.string
  },
  getImagePath() {
    return this.props.scriptsBasePath + require('../media/' + this.props.imageName);
  },
  render() {
    return (
      <span>
         <Image className="center-block" src={this.getImagePath()} responsive />
      </span>
    );
  }
});
