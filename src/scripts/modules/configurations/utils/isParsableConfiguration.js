var Immutable = require('immutable');

export default function(configuration, parseFunction, createFunction, normalizeFunction) {
  if (configuration.isEmpty()) {
    return true;
  }
  const parsed = parseFunction(configuration);
  const reconstructed = createFunction(parsed);
  /*
    normalize function takes the original configuration and fills in optional properties
    so that the config can be visually displayed when a new configuration parameter in the ui
    is introduced
    see the test
   */
  if (normalizeFunction) {
    const normalized = normalizeFunction(configuration);
    return Immutable.is(normalized, reconstructed);
  } else {
    return Immutable.is(configuration, reconstructed);
  }
}
