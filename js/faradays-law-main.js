// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Faradays Law' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  var FaradaysLawScreen = require( 'FARADAYS_LAW/faradays-law/FaradaysLawScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!FARADAYS_LAW/faradays-law.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Bryce Gruneich',
      softwareDevelopment: 'John Blanco, Jonathan Olson',
      team: 'Michael Dubson, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team\n' +
              'to convert this simulation to HTML5.'
    }
  };

  //Create and start the sim
  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new FaradaysLawScreen() ], simOptions );
    sim.start();
  } );
} );