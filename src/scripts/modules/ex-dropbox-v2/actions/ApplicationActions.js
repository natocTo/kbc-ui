export function getDestinationName(fileName) {
  let destinationFile = fileName.toString().split('/');
  let file = destinationFile[destinationFile.length - 1].slice(0, -4);

  return `${file}`;
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
