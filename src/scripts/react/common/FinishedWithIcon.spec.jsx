import React from 'react';
import FinishedWithIcon from './FinishedWithIcon';

describe('<FinishedWithIcon />', function() {
  it('should render Invalid data title with empty endTime', function() {
    shallowSnapshot(<FinishedWithIcon endTime="" />);
  });

  it('should render with some endTime', function() {
    shallowSnapshot(<FinishedWithIcon endTime="2018-06-21" />);
  });
});
