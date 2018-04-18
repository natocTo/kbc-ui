import {Map, fromJS} from 'immutable';
import TablesStore from '../../components/stores/StorageTablesStore';


const repass = param => param;
const returnEmptyMap = () =>  Map();

function parseBySections(rootParseFn, sectionsParseFn, configuration) {
  const tables = TablesStore.getAll();
  const rootParsed = rootParseFn(configuration, tables);
  const sectionsParsed = sectionsParseFn.map(parseSectionFn => parseSectionFn(rootParsed, tables));
  const parsedConfiguration = Map({
    root: rootParsed,
    sections: sectionsParsed
  });

  return parsedConfiguration;
}


function createBySections(createFn, sectionsCreateFn, configurationBySections) {
  const configurationSectionsMerged = configurationBySections
    .get('sections')
    .reduce((memo, sectionConfig, idx) => {
      const createSectionFn = sectionsCreateFn.get(idx);
      return memo.merge(createSectionFn(sectionConfig));
    }, Map());

  const configurationRoot = configurationBySections.get('root');
  return createFn(configurationRoot.merge(configurationSectionsMerged));
}

function createEmptyConfigBySections(createEmptyFn, sectionsCreateEmptyFn, createFn, sectionsCreateFn, name, webalizedName) {
  const sectionsData = sectionsCreateEmptyFn.map(sectionCreateFn => sectionCreateFn(name, webalizedName));
  const root = createEmptyFn(name, webalizedName);
  const configurationBySections = fromJS({
    root,
    sections: sectionsData
  });

  return createBySections(createFn, sectionsCreateFn, configurationBySections);
}


export default {
  makeParseFn(rootParseFn, sections) {
    const sectionsParseFn = sections.map( section => section.get('onLoad') || repass);
    return configuration => parseBySections(rootParseFn || repass, sectionsParseFn, configuration);
  },

  makeCreateFn(rootCreateFn, sections) {
    const sectionsCreateFn = sections.map(section => section.get('onSave') || repass);
    return configuration => createBySections(rootCreateFn || repass, sectionsCreateFn, configuration);
  },

  makeCreateEmptyFn(rootCreateEmptyFn, rootCreateFn, sections) {
    const sectionsCreateFn = sections.map(section => section.get('onSave') || repass);
    const sectionsCreateEmptyFn = sections.map(section => section.get('onCreate') || returnEmptyMap);
    return (name, webalizedName) => createEmptyConfigBySections(rootCreateEmptyFn || returnEmptyMap, sectionsCreateEmptyFn, rootCreateFn || repass, sectionsCreateFn, name, webalizedName);
  }
};