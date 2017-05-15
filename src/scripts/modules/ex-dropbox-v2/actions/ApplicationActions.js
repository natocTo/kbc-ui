export function getDestinationName(fileName) {
  let destinationFile = fileName.toString().split('/');
  let resultName = destinationFile[destinationFile.length - 1];
  if (resultName.endsWith('.csv')) {
    resultName = resultName.slice(0, -4);
  }
  return resultName;
}

export function sortTimestampsInDescendingOrder(obj1, obj2) {
  if (obj1.timestamp < obj2.timestamp) {
    return 1;
  } else if (obj1.timestamp > obj2.timestamp) {
    return -1;
  } else {
    return 0;
  }
}

export function sortTimestampsInAscendingOrder(obj1, obj2) {
  if (obj1.timestamp > obj2.timestamp) {
    return 1;
  } else if (obj1.timestamp < obj2.timestamp) {
    return -1;
  } else {
    return 0;
  }
}
