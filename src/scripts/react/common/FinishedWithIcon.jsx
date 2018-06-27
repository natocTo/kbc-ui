import React from 'react';
import Finished from './Finished';
import date from '../../utils/date';


const FinishedWithIcon = ({endTime}) => (
  <span title={date.format(endTime)}>
    <i className="fa fa-calendar" />
    {' '}
    <Finished endTime={endTime} />
  </span>
);

FinishedWithIcon.propTypes = {
  endTime: React.PropTypes.string
};

export default FinishedWithIcon;
