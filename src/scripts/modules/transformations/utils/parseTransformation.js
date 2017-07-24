export default function(rowConfig) {
  // deep cloning hack
  var transformationConfig = JSON.parse(JSON.stringify(rowConfig.configuration));

  // force propagate id
  transformationConfig.id = rowConfig.id;

  // take name from parent if not empty
  if (rowConfig.name && rowConfig.name !== '') {
    transformationConfig.name = rowConfig.name;
  }

  // inject missing defaults
  if (!transformationConfig.phase) {
    transformationConfig.phase = 1;
  }
  if (!transformationConfig.queries) {
    transformationConfig.queries = [];
  }
  if (!transformationConfig.requires) {
    transformationConfig.requires = [];
  }
  if (!transformationConfig.input) {
    transformationConfig.input = [];
  }
  if (!transformationConfig.output) {
    transformationConfig.output = [];
  }
  if (!transformationConfig.packages) {
    transformationConfig.packages = [];
  }
  if (transformationConfig.input.length > 0) {
    for (var key in transformationConfig.input) {
      if (Array.isArray(transformationConfig.input[key].datatypes)) {
        transformationConfig.input[key].datatypes = {};
      }
    }
  }
  if (!transformationConfig.disabled) {
    transformationConfig.disabled = false;
  }
  if (transformationConfig.disabled === '0') {
    transformationConfig.disabled = false;
  }
  if (transformationConfig.disabled === '1') {
    transformationConfig.disabled = true;
  }
  return transformationConfig;
}
