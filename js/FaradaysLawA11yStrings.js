// Copyright 2018, University of Colorado Boulder

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
    playAreaContainsString: {
      value: 'Simulation Play Area contains:'
    },
    aLightbulbString: {
      value: 'a lightbulb'
    },
    circuitAndCoilPatternString: {
      value: 'a ligthbulb circuit with {{coilString}}'
    },
    coilProximityPatternString: {
      value: '{{proximity}} to the {{number}} loop coil'
    },
    magnetPositionPatternString: {
      value: 'a magnet located at the {{position}} of the Play Area'
    },
    aVoltMeterString: {
      value: 'a volt meter'
    },
    aFourLoopCoilString: {
      value: 'a 4 loop coil'
    },
    theFourLoopCoilString: {
      value: 'the 4 loop coil'
    },
    aTwoLoopCoilString: {
      value: 'a 2 loop coil'
    },
    theTwoLoopCoilstring: {
      value: 'the 2 loop coil'
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
    twoWordsPatternString: {
      value: '{{first}} {{second}}'
    },
    twoWordsCommaPatternString: {
      value: '{{first}}, {{second}}'
    },
    aString: {
      value: 'a'
    },
    andString: {
      value: 'and'
    },
    moveMagnetToPlayString: {
      value: 'Move the magnet to play.'
    },
    topLeftString: {
      value: 'top-left'
    },
    topCenterString: {
      value: 'top-center'
    },
    topRightString: {
      value: 'top-right'
    },
    middleLeftString: {
      value: 'middle-left'
    },
    centerString: {
      value: 'center'
    },
    middleRightString: {
      value: 'middle-right'
    },
    bottomLeftString: {
      value: 'bottom-left'
    },
    bottomCenterString: {
      value: 'bottom-center'
    },
    bottomRightString: {
      value: 'bottom-right'
    },
    edgeString: {
      value: 'edge'
    },
    inString: {
      value: 'in'
    }
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( FaradaysLawA11yStrings ); }

  faradaysLaw.register( 'FaradaysLawA11yStrings', FaradaysLawA11yStrings );

  return FaradaysLawA11yStrings;
} );
