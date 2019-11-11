// Copyright 2018-2019, University of Colorado Boulder

/**
 * Strings for a11y-specific usage.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  // const inherit = require( 'PHET_CORE/inherit' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  const FaradaysLawA11yStrings = {

    /************************
     * SUMMARY AND HEADINGS *
     ************************/

    summaryDescription: {
      value: 'The play area has a light bulb circuit, and a moveable bar magnet. There are controls that change what is connected to the circuit,  flip the bar magnet, and reset the sim.'
    },

    // magnet description in summary
    moveMagnetToPlay: {
      value: 'Move the magnet to play using arrow keys, W A S D, or 1 2 3 keys.'
    },

    // headings
    lightBulbCircuitLabel: {
      value: 'Light Bulb Circuit'
    },
    barMagnet: {
      value: 'Bar Magnet'
    },

    /**************************************
     * Circuit descriptions and help text *
     **************************************/
    inTheCircuit: {
      value: 'In circuit are a:'
    },
    flipMagnet: {
      value: 'Flip Magnet'
    },
    flipPoles: {
      value: 'Flip North and South poles.'
    },
    singleCoilDescription: {
      value: 'The coil is sideways, with openings on the left and right.'
    },
    doubleCoilDescription: {
      value: 'The coils are sideways, with openings on the left and right.'
    },
    voltmeter: {
      value: 'Voltmeter'
    },
    lightBulb: {
      value: 'Light bulb'
    },
    voltmeterDescription: {
      value: 'Play with or without voltmeter connected to light bulb circuit'
    },
    circuitFourCoilOnly: {
      value: 'In circuit are a light bulb and 4 loop coil.'
    },
    circuitFourCoilAndVoltmeter: {
      value: 'In circuit are a light bulb, a 4 loop coil, and a voltmeter.'
    },
    circuitDescriptionPattern: {
      value: '{{circuitContents}} {{coilDescription}}'
    },
    aLightbulb: {
      value: 'a lightbulb'
    },
    aVoltMeter: {
      value: 'a voltmeter'
    },
    aCoilPattern: {
      value: 'a {{coil}}'
    },
    theCoilPattern: {
      value: 'the {{coil}}'
    },
    fourLoopCoil: {
      value: '4 loop coil'
    },
    theFourLoopCoil: {
      value: 'the 4 loop coil'
    },
    twoLoopCoil: {
      value: '2 loop coil'
    },
    theTwoLoopCoil: {
      value: 'the 2 loop coil'
    },

    // coil field strengths
    fieldStrengthPassingPattern: {
      value: ' {{fieldStrength}} magnetic field passing through.'
    },
    fieldStrengthPassingCoilPattern: {
      value: '{{strength}} magnetic field passing through {{coil}}.'
    },
    fieldStrengthPassingBothCoilsPattern: {
      value: '{{strength}} magnetic field passing through both 4 loop and 2 loop coils.'
    },
    circuitNowHasPattern: {
      value: 'Circuit now has {{coil}}.'
    },
    oneCoil: {
      value: 'one coil'
    },
    twoCoils: {
      value: 'two different coils'
    },
    numberOneCoil: {
      value: '1 coil'
    },
    numberTwoCoil: {
      value: '2 coil'
    },

    /*************************************
     * Magnet Descriptions and Help Text *
     *************************************/

     // polarity
     poleOnThePattern: {
       value: '{{pole}} pole on {{side}}'
     },
     north: {
       value: 'North'
     },
     south: {
       value: 'South'
     },

     // field lines/strength
     fieldLines: {
       value: 'Field Lines'
     },
     fieldLinesDescriptionPattern: {
       value: 'Magnetic field lines go around from North end on {{northSide}} side of magnet, to South end on {{southSide}} side of magnet.'
     },
     fieldLinesDescriptionUpdated: {
       value: 'Field lines description updated.'
     },
     fourLoopOnlyFieldStrengthPattern: {
       value: 'From the magnet\'s position, a {{fieldStrength}} magnetic field is passing through the 4 loop coil.'
     },
     fieldStrengthIs: {
       value: 'The magnet field strength is:'
     },
     fieldStrengthPattern: {
       value: '{{fieldStrength}} at {{coil}}'
     },

     /*********************************
      * Magnet slide behavior strings *
      *********************************/
     slowly: {
       value: 'slowly'
     },
     normally: {
       value: 'normally'
     },
     quickly: {
       value: 'quickly'
     },
     magnetSlidingAlertPattern: {
       value: 'Magnet sliding {{direction}}. Space to stop.'
     },
     slidingStopped: {
       value: 'Sliding stopped.'
     },
     left: {
       value: 'left'
     },
     right: {
       value: 'right'
     },

    /*********************************************
     * Magnet location pattern and value strings *
     *********************************************/
    magnetAtPositionPattern: {
      value: 'Magnet at {{position}}.'
    },
    barMagnetPositionPattern: {
      value: 'The bar magnet is {{areaPosition}}'
    },
    barMagnetIs: {
      value: 'The bar magnet is:'
    },
    positionOfPlayAreaPattern: {
      value: 'at the {{position}} of the Play Area.'
    },
    barMagnetHelpText: {
      value: 'Use the W A S D keys to move the magnet in four directions. Use 1 2 3 keys to slide magnet left and right.'
    },
    magnetLocationAlertPattern: {
      value: 'Magnet at {{position}} of Play Area.'
    },
    magnetLocationExtraAlertPattern: {
      value: 'Magnet at {{position}} of Play Area. W A S D and 1 2 3 keys moves magnet.'
    },
    slidingStoppedLinesInvisibleMagnetLocationPattern: {
      value: 'Sliding stopped. {{magnetLocation}} {{coilProximity}}'
    },
    slidingStoppedLinesVisibleMagnetLocationPattern: {
      value: 'Sliding stopped. {{magnetLocation}} {{coilProximity}} Field lines description updated.'
    },
    touchingSideOfCoilPattern: {
      value: 'Touching {{side}} of {{coil}}.'
    },
    magnetPositionProximityPattern: {
      value: '{{magnetPosition}}. {{coilProximity}}.'
    },

    // play area locations
    topLeft: {
      value: 'top-left'
    },
    topCenter: {
      value: 'top-center'
    },
    topRight: {
      value: 'top-right'
    },
    middleLeft: {
      value: 'middle-left'
    },
    center: {
      value: 'center'
    },
    middleRight: {
      value: 'middle-right'
    },
    bottomLeft: {
      value: 'bottom-left'
    },
    bottomCenter: {
      value: 'bottom-center'
    },
    bottomRight: {
      value: 'bottom-right'
    },
    edge: {
      value: 'edge'
    },

    // magnet alert patterns
    slidingAndPositionFourCoilPattern: {
      value: '{{slidingAndPositionPhrase}} {{fourCoil}}'
    },
    slidingStoppedPositionPattern: {
      value: '{{slidingStopped}} {{magnetPosition}}'
    },
    fourCoilTwoCoilFieldLinesPattern: {
      value: '{{fourCoil}} {{twoCoilFieldLines}}'
    },
    twoCoilFieldLinesPattern: {
      value: '{{twoCoil}} {{fieldLines}}'
    },
    slidingStoppedPositionFourCoilTwoCoilFieldLinesPattern: {
      value: '{{slidingAndPositionPhrase}} {{fourCoil}} {{twoCoilFieldLines}}'
    },

    /********************************
     * Magnet coil proximity values *
     ********************************/
    in: {
      value: 'In'
    },
    farFrom: {
      value: 'Far from'
    },
    closeTo: {
      value: 'Close to'
    },
    veryCloseTo: {
      value: 'Very close to'
    },
    exitingCoilPattern: {
      value: 'Exiting {{coil}}'
    },
    noCoilPattern: {
      value: 'Coil no longer to {{direction}}'
    },
    coilToDirectionPattern: {
      value: '{{coil}} to {{direction}}'
    },
    proximityToFourCoilPattern: {
      value: '{{proximity}} 4-loop coil'
    },
    proximityToTwoCoilPattern: {
      value: '{{proximity}} 2-loop coil'
    },
    bumpingCoilPattern: {
      value: 'Bumping {{coil}} coil'
    },

    /*********************************
     * Field strength at coil values *
     *********************************/
    minimal: {
      value: 'Minimal'
    },
    veryWeak: {
      value: 'Very weak'
    },
    weak: {
      value: 'Weak'
    },
    strong: {
      value: 'Strong'
    },
    veryStrong: {
      value: 'Very strong'
    },

    /*****************************************************
     * Control Area Descriptions, Help Text, and Alerts *
     *****************************************************/
    fieldLinesVisibilityPattern: {
      value: 'Magnetic field lines {{visibility}}.'
    },
    hidden: {
      value: 'hidden'
    },
    visible: {
      value: 'visible'
    },
    voltmeterAlertPattern: {
      value: 'Voltmeter {{attachmentState}} circuit.'
    },
    connected: {
      value: 'connected to'
    },
    removed: {
      value: 'removed from'
    },
    flippingMagnetPattern: {
      value: 'Magnet flipped. North pole on {{northSide}}. South pole on {{southSide}}.'
    },
    circuitMode: {
      value: 'Circuit Mode'
    },
    fieldLinesDescription: {
      value: 'Add or remove magnetic field lines.'
    },

    /*********************************
     * Generic patterns and articles *
     *********************************/
     twoItemPattern: {
       value: '{{first}} and {{second}}'
     },
     threeItemPattern: {
       value: '{{first}}, {{second}}, and {{third}}'
     },
     fourItemPattern: {
       value: '{{first}}, {{second}}, {{third}}, and {{fourth}}'
     },
     twoWordsPattern: {
       value: '{{first}} {{second}}'
     },
     threeWordsPattern: {
       value: '{{first}} {{second}} {{third}}'
     },
     twoWordsCommaPattern: {
       value: '{{first}}, {{second}}'
     },
     a: {
       value: 'a'
     },
     and: {
       value: 'and'
     }
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( FaradaysLawA11yStrings ); }

  faradaysLaw.register( 'FaradaysLawA11yStrings', FaradaysLawA11yStrings );

  return FaradaysLawA11yStrings;
} );
