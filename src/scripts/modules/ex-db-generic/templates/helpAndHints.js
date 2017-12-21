
const queryEditorPlaceholder = {
  'default': 'e.g. SELECT "id", "name" FROM "myTable"',
  'keboola.ex-db-mysql': 'e.g. SELECT `id`, `name` FROM `myTable`'
};

export function getQueryEditorPlaceholder(componentId) {
  return queryEditorPlaceholder[componentId] ? queryEditorPlaceholder[componentId] : queryEditorPlaceholder.default;
}

const queryEditorHelp = {
  'keboola.ex-db-oracle': 'Please do not put semicolons at the end of the query.'
};

export function getQueryEditorHelpText(componentId) {
  return queryEditorHelp[componentId] ? queryEditorHelp[componentId] : null;
}
