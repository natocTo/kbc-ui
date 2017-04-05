import React from 'react';
import ApplicationStore from '../../../../stores/ApplicationStore';
import image from '../../../../../images/transformation-empty-input-small.png';

export default React.createClass({
  imageUrl(img) {
    return ApplicationStore.getScriptsBasePath() + img;
  },

  render() {
    return (
      <span>
        <img src={this.imageUrl(image)}/>
      </span>
    );
  }
});
