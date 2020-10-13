// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Faradays Law' sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import FaradaysLawScreen from './faradays-law/FaradaysLawScreen.js';
import faradaysLawStrings from './faradaysLawStrings.js';

// constants
const faradaysLawTitleString = faradaysLawStrings[ 'faradays-law' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Michael Dubson, Bryce Gruneich',
    softwareDevelopment: 'John Blanco, Jonathan Olson',
    team: 'Michael Dubson, Ariel Paul, Kathy Perkins, Amy Rouinfar',
    qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin',
    thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation ' +
            'to HTML5.'
  },
  hasKeyboardHelpContent: true
};

// Create and start the sim
simLauncher.launch( function() {
  const sim = new Sim( faradaysLawTitleString, [
    new FaradaysLawScreen( Tandem.ROOT.createTandem( 'faradaysLawScreen' ) )
  ], simOptions );
  sim.start();
} );