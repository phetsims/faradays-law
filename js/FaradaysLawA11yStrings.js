// Copyright 2018, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  // var inherit = require( 'PHET_CORE/inherit' );

  var FaradaysLawA11yStrings = {
    sceneSummaryString: {
      value: 'Faraday\'s Law is an interactive sim. It changes as you play with it.'
    },
    summaryDescriptionString: {
      value: 'The play area has a light bulb circuit, and a moveable bar magnet. There are controls that change what is connected to the circuit,  flip the bar magnet, and reset the sim.'
    },
    moveMagnetToPlayString: {
      value: 'Move the magnet to play.'
    },
    lightBulbCircuitLabelString: {
      value: 'Light Bulb Circuit'
    },
    circuitFourCoilOnlyString: {
      value: 'In circuit are a light bulb and 4 loop coil. The coil is open on the left and right - the bar magnet can pass through.'
    },
    lightbulbCircuitPatternString: {
      value: 'The light bulb circuit has a {{loops}} coil connected. {{coils}} open on the left and right, allowing the bar magnet to pass through.'
    },
    voltMeterAttachedString: {
      value: 'A volt meter attached is also attached to the circuit.'
    },
    aLightbulbString: {
      value: 'a lightbulb'
    },
    magnetPositionPatternString: {
      value: 'a magnet located at the {{position}} of the Play Area'
    },
    aVoltMeterString: {
      value: 'a volt meter'
    },
    aNumberLoopPatternString: {
      value: 'a {{number}} loop'
    },
    theNumberLoopPatternString: {
      value: 'the {{number}} loop'
    },
    aLoopCoilPatternString: {
      value: 'a {{loops}} coil'
    },
    theLoopCoilPatternString: {
      value: 'the {{loops}} coil'
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
    proximityToPatternString: {
      value: '{{proximity}} to {{coil}}'
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
    },
    farFromString: {
      value: 'far from'
    },
    closeToString: {
      value: 'close to'
    },
    veryCloseToString: {
      value: 'very close to'
    },
    leftString: {
      value: 'left'
    },
    rightString: {
      value: 'right'
    },
    barMagnetIsString: {
      value: 'The bar magnet is'
    },
    atLocationPatternString: {
      value: 'at the {{location}} of the Play Area.'
    }
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( FaradaysLawA11yStrings ); }

  faradaysLaw.register( 'FaradaysLawA11yStrings', FaradaysLawA11yStrings );

  return FaradaysLawA11yStrings;
} );
