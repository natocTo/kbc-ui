import React, {PropTypes} from 'react';
import Clipboard from '../../../../react/common/Clipboard';

const TokenString = ({token}) => {
  const tokenString = token.get('token');
  return (
    <pre>
      <div>
        {tokenString}
      </div>
      <Clipboard text={tokenString} label="Copy token to clipboard"/>
    </pre>
  );
};

TokenString.propTypes = {
  token: PropTypes.object.isRequired
};


export default TokenString;
