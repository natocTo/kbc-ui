function tableInput(mapping) {
  if (mapping.has('columns') && mapping.get('columns').count() > 0) {
    return true;
  }

  if (mapping.get('where_column')) {
    return true;
  }

  if (mapping.get('changed_since')) {
    return true;
  }

  if (mapping.has('where_values') && mapping.get('where_values').size > 0) {
    return true;
  }
  return false;
}

function fileInput(mapping) {
  if (mapping.has('processed_tags') && mapping.get('processed_tags').count() > 0) {
    return true;
  }

  if (mapping.has('query') && mapping.get('query').length > 0) {
    return true;
  }
  return false;
}

export default function(mapping, type) {
  if (type === 'tableInput') {
    return tableInput(mapping);
  } else if (type === 'fileInput') {
    return fileInput(mapping);
  } else {
    return false;
  }
}