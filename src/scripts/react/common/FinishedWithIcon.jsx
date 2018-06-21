import React from 'react';
import Finished from './Finished';
import date from '../../utils/date';


const FinishedWithIcon = (props) => (
  <span title={date.format(props.endTime)}>
    <i className="fa fa-calendar" />
    {' '}
    <Finished endTime={props.endTime} />
  </span>
);

FinishedWithIcon.propTypes = {
  endTime: React.PropTypes.string
};

export default FinishedWithIcon;
