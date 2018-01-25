import React, {PropTypes} from 'react';
import Clipboard from '../../../../react/common/Clipboard';

const TokenString = ({token, children}) => {
  const tokenString = token.get('token');
  return (
    <pre>
      <div>
        {tokenString}
      </div>
      <Clipboard text={tokenString} label="Copy token to clipboard"/>
      {children}
    </pre>
  );
};

TokenString.propTypes = {
  token: PropTypes.object.isRequired,
  children: PropTypes.any
};


export default TokenString;
