import * as StringBuilder from 'stringbuilder'
StringBuilder.extend('string')

const rdflibConstants = {
  XMLNS: 'xmlns',
  OWL: 'owl',
  XSD: 'xsd',
  RDF: 'rdf',
  RDFS: 'rdfs',
  OWL_URI: 'http://www.w3.org/2002/07/owl#',
  XSD_URI: 'http://www.w3.org/2001/XMLSchema#',
  RDF_URI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  RDFS_URI: 'http://www.w3.org/2000/01/rdf-schema#',
  OWL_ATTR: {
    ONTOLOGY: 'Ontology',
    NAMED_INDIVIDUAL: 'NamedIndividual',
    VERSION_IRI: 'versionIRI',
    IMPORTS: 'imports'
  },
  RDF_ATTR: {
    RDF: 'RDF',
    ABOUT: 'about',
    TYPE: 'type',
    RESOURCE: 'resource',
    DATATYPE: 'datatype'
  },
  START_TAG: '<{0}:{1}>',
  START_TAG_WITH_ATTR: '<{0}:{1} {2}>',
  SPLIT_START_TAG: {P1: '<{0}:{1}', P2: '>'},
  END_TAG: '</{0}:{1}>',
  TAG: '{0}{{1}}{1}'.format(this.START_TAG, this.END_TAG),
  ATTR: '{0}:{1}="{2}"',
  // eslint-disable-next-line no-useless-escape
  WHITESPACE: '\s',
  SINGLE_TAB: '\t',
  DOUBLE_TAB: '\t\t'
}

export default rdflibConstants
