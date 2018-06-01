var Immutable = require('immutable');

export default function(configuration, parseFunction, createFunction, conformFunction) {
  if (configuration.isEmpty()) {
    return true;
  }
  const conformConfig = conformFunction || ((config) => config);
  const parsed = parseFunction(configuration);
  const reconstructed = createFunction(parsed);
  return Immutable.is(conformConfig(configuration), reconstructed);
}
