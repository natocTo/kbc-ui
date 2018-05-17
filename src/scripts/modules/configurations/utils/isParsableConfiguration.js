var Immutable = require('immutable');

export default function(configuration, parseFunction, createFunction) {
  if (configuration.isEmpty()) {
    return true;
  }
  const parsed = parseFunction(configuration);
  const reconstructed = createFunction(parsed);
  /*
    incomplete configurations (eg. missing certain keys)
    that do not affect the config itself should be considered parsable
    merging is is used for backward compatibility when a property is added
  */
  const merged = configuration.mergeDeep(reconstructed);
  return Immutable.is(merged, reconstructed);
}
