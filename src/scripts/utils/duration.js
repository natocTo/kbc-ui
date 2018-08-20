export const timeInWords = (duration, round) => {
  const days = Math.floor(duration / 86400);
  const hours = Math.floor(duration % 86400 / 3600);
  const minutes = Math.floor(duration % 3600 / 60);
  const seconds = duration % 60;
  if (days > 0) {
    return 'more than 24 hrs';
  } else {
    if (duration === 0) {
      return  '0 sec';
    }
    let result = [];
    if (hours === 1) {
      result.push(hours + ' hr');
    }
    if (hours > 1) {
      result.push(hours + ' hrs');
    }
    if (minutes > 0) {
      result.push(minutes + ' min');
    }
    if (seconds > 0 && (!round || hours === 0)) {
      result.push(seconds + ' sec');
    }
    if (result.length > 0) {
      return result.join(' ');
    } else {
      return '';
    }
  }
};

// origin: https://github.com/travis-ci/travis-web/blob
//                /aa06f3947eaeeedf594a59f0ce629ad4cd2763c6/assets/scripts
//                /app/helpers/helpers
export const durationFrom = (started, finished) => {
  return (new Date(finished).getTime() - new Date(started).getTime()) / 1000;
};
