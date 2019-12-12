// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main entry point for the 'Faradays Law' sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const FaradaysLawScreen = require( 'FARADAYS_LAW/faradays-law/FaradaysLawScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const faradaysLawTitleString = require( 'string!FARADAYS_LAW/faradays-law.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Bryce Gruneich',
      softwareDevelopment: 'John Blanco, Jonathan Olson',
      team: 'Michael Dubson, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation ' +
              'to HTML5.'
    }
  };

  // Create and start the sim
  SimLauncher.launch( function() {
    const sim = new Sim( faradaysLawTitleString, [
      new FaradaysLawScreen( Tandem.ROOT.createTandem( 'faradaysLawScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );