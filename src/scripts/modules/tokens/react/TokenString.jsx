import React, {PropTypes} from 'react';
// import Clipboard from '../../../react/common/Clipboard';

const TokenString = ({token}) => {
  const tokenString = token.get('token');
  return (
    <pre>
      {tokenString}
      {/* <div>
          <Clipboard text={token} label="Copy token to clipboard"/>
          </div> */}
    </pre>
  );
};

TokenString.propTypes = {
  token: PropTypes.object.isRequired
};


export default TokenString;
