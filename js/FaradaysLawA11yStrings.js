// Copyright 2014-2017, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  // var inherit = require( 'PHET_CORE/inherit' );

  var FaradaysLawA11yStrings = {
    playAreaContentDescriptionString: {
      value: 'Simulation Play Area contains a circuit and a magnet.'
    },
    summaryCircuitHelpTextPatternString: {
      value: 'Currently, the circuit consist of {{circuitParts}}. These parts are connected together with wires from the circuit.'
    },
    aLightbulbString: {
      value: 'a lightbulb'
    },
    aVoltMeterString: {
      value: 'a volt meter'
    },
    aFourLoopCoilString: {
      value: 'a four-loop coil'
    },
    aTwoLoopCoilString: {
      value: 'a two-loop coil'
    },
    twoItemPatternString: {
      value: '{{first}} and {{second}}'
    },
    threeItemPatternString: {
      value: '{{first}}, {{second}}, and {{third}}'
    },
    fourItemPatternString: {
      value: '{{first}}, {{second}}, {{third}}, and {{fourth}}'
    },
    aString: {
      value: 'a'
    },
    andString: {
      value: 'and'
    },
    moveMagnetToPlayString: {
      value: 'Move the magnet to play.'
    }
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( FaradaysLawA11yStrings ); }

  faradaysLaw.register( 'FaradaysLawA11yStrings', FaradaysLawA11yStrings );

  return FaradaysLawA11yStrings;
} );
