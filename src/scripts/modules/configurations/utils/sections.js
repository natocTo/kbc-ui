import { Map, fromJS, List } from 'immutable';
import TablesStore from '../../components/stores/StorageTablesStore';

const repass = param => param;
const returnEmptyMap = () => Map();
const returnTrue = () => true;

function parseBySections(sectionsParseFn, configuration) {
  const tables = TablesStore.getAll();
  const sectionsParsed = sectionsParseFn.map(parseSectionFn => parseSectionFn(configuration, tables));
  const parsedConfiguration = Map({
    sections: sectionsParsed
  });
  return parsedConfiguration;
}

function createBySections(sectionsCreateFn, configurationBySections) {
  const configuration = configurationBySections
    .get('sections', List())
    .reduce((memo, sectionConfig, index) => {
      const createSectionFn = sectionsCreateFn.get(index);
      return memo.mergeDeep(createSectionFn(sectionConfig));
    }, Map());

  return configuration;
}

function createEmptyConfigBySections(
  sectionsCreateEmptyFn,
  sectionsCreateFn,
  name,
  webalizedName
) {
  const sectionsData = sectionsCreateEmptyFn.map(sectionCreateFn => sectionCreateFn(name, webalizedName));
  const configurationBySections = fromJS({
    sections: sectionsData
  });

  return createBySections(sectionsCreateFn, configurationBySections);
}

function isCompleteBySections(sectionsIsCompleteFn, configuration) {
  const sectionsIsComplete = sectionsIsCompleteFn.reduce((memo, isCompleteFn) => {
    return memo && isCompleteFn(configuration);
  }, true);
  return sectionsIsComplete;
}

export default {
  makeParseFn(sections) {
    const sectionsParseFn = sections.map(section => section.get('onLoad') || repass);
    return configuration => parseBySections(sectionsParseFn, configuration);
  },

  makeCreateFn(sections) {
    const sectionsCreateFn = sections.map(section => section.get('onSave') || repass);
    return configuration => createBySections(sectionsCreateFn, configuration);
  },

  makeCreateEmptyFn(sections) {
    const sectionsCreateFn = sections.map(section => section.get('onSave') || repass);
    const sectionsCreateEmptyFn = sections.map(section => section.get('onCreate') || returnEmptyMap);
    return (name, webalizedName) =>
      createEmptyConfigBySections(
        sectionsCreateEmptyFn,
        sectionsCreateFn,
        name,
        webalizedName
      );
  },

  isComplete(sections, configuration) {
    const sectionsIsCompleteFn = sections.map(section => section.get('isComplete', returnTrue));
    return isCompleteBySections(sectionsIsCompleteFn, configuration);
  }
};
