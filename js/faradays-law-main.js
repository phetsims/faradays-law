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
    softwareDevelopment: 'Michael Barlow, John Blanco, Jonathan Olson',
    team: 'Emily B. Moore, Ariel Paul, Kathy Perkins, Amy Rouinfar, Taliesin Smith',
    soundDesign: 'Ashton Morris, Mike Winters',
    qualityAssurance: 'Jaspe Arias, Steele Dalton, Brooklyn Lash, Elise Morgan, Liam Mulhall,<br>' +
                      'Oliver Orejola, Devon Quispe, Katie Woessner, Bryan Yoelin',
    contributors: 'Jonathan Hung & Caren Watkins (Inclusive Design Research Centre)',
    thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation ' +
            'to HTML5.'
  },
  hasKeyboardHelpContent: true
};

// Create and start the sim
simLauncher.launch( () => {
  const sim = new Sim( faradaysLawTitleString, [
    new FaradaysLawScreen( Tandem.ROOT.createTandem( 'faradaysLawScreen' ) )
  ], simOptions );
  sim.start();
} );