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
      value: 'Currently, the circuit consist of a lightbulb{{circuitParts}}. These parts are connected together with wires from the circuit.'
    },
    lightbulbString: {
      value: 'lightbulb'
    },
    voltMeterString: {
      value: 'volt meter'
    },
    fourLoopCoilString: {
      value: 'four-loop coil'
    },
    twoLoopCoilString: {
      value: 'two-loop coil'
    },
    aString: {
      value: 'a'
    },
    andString: {
      value: 'and'
    },
    spaceCommaPatternString: {
      value: ' {{word}},'
    },
    spacePatternString: {
      value: ' {{word}} '
    }
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( FaradaysLawA11yStrings ); }

  faradaysLaw.register( 'FaradaysLawA11yStrings', FaradaysLawA11yStrings );

  return FaradaysLawA11yStrings;
} );
