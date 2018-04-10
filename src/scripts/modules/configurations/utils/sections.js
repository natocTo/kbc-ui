import {Map} from 'immutable';

const repass = param => param;

function parseBySections(rootParseFn, sectionsParseFn, configuration) {
  const rootParsed = rootParseFn(configuration);
  const sectionsParsed = sectionsParseFn.map((parseSectionFn = repass) => parseSectionFn(rootParsed));
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


export default {
  makeParseFn(rootParseFn, sections) {
    const sectionsParseFn = sections.map( section => section.get('onLoad') || repass);
    return configuration => parseBySections(rootParseFn || repass, sectionsParseFn, configuration);
  },

  makeCreateFn(rootCreateFn, sections) {
    const sectionsCreateFn = sections.map(section => section.get('onSave') || repass);
    return configuration => createBySections(rootCreateFn || repass, sectionsCreateFn, configuration);
  }
};
