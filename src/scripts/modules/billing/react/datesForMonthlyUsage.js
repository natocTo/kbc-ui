
export function compute(
  collectingStartDateMoment,
  nowMoment,
  projectCreationDateMoment
) {
  const dateFromMoment = projectCreationDateMoment.isValid() && projectCreationDateMoment.isAfter(collectingStartDateMoment)
    ? projectCreationDateMoment
    : collectingStartDateMoment;
  const dateToMoment = nowMoment.subtract(1, 'day');

  if (dateFromMoment.isAfter(dateToMoment)) {
    return {
      dateFrom: dateToMoment.format('YYYY-MM-DD'),
      dateTo: dateToMoment.format('YYYY-MM-DD')
    };
  } else {
    return {
      dateFrom: dateFromMoment.format('YYYY-MM-DD'),
      dateTo: dateToMoment.format('YYYY-MM-DD')
    };
  }
}
