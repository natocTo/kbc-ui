// given cardinal number as string or int function returns formated number with comma thousands separator
export default function(numberStr) {
  if (!numberStr && numberStr !== 0) {
    return 'N/A';
  }
  const number = parseInt(numberStr, 10);
  if (!number && number !== 0) {
    return 'N/A';
  }
  return number.toLocaleString('en-US');
}
