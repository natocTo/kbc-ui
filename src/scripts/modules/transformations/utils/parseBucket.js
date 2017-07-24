import parseTransformation from './parseTransformation';

export default function(bucket) {
  // deep cloning hack
  var response = JSON.parse(JSON.stringify(bucket));
  response.transformations = response.rows;
  delete response.rows;
  if (response.transformations) {
    for (var i = 0; i < response.transformations.length; i++) {
      response.transformations[i] = parseTransformation(response.transformations[i]);
    }
  } else {
    response.transformations = [];
  }
  return response;
}
