import React from 'react';
import {Loader} from '@keboola/indigo-ui';

export default React.createClass({

  render() {
    return (
      <div className="text-center" style={{padding: '2em 0'}}>
        <Loader className="fa-2x"/>
      </div>
    );
  }

});
