// Copyright 2002-2014, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Faradays Law' sim.
 * Paths are relative to the location of this file.
 */
require.config( {

  deps: ['faradays-law-main'],

  paths: {

    // plugins
    image: '../../chipper/requirejs-plugins/image',
    string: '../../chipper/requirejs-plugins/string',

    text: '../../sherpa/text',

    // PhET libs, uppercase names to identify them in require.js imports
    AXON: '../../axon/js',
    BRAND: '../../brand/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    PHETCOMMON: '../../phetcommon/js',
    PHET_CORE: '../../phet-core/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SHERPA: '../../sherpa',
    SUN: '../../sun/js',
    // sim code
    FARADAYS_LAW: '.'
  },

  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
} );
