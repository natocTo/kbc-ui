const ports = {
  'keboola.ex-mongodb': 27017
};

export default function(componentId) {
  return ports[componentId];
}
