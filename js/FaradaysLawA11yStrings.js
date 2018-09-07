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

    /************************
     * SUMMARY AND HEADINGS *
     ************************/

    summaryDescription: {
      value: 'The play area has a light bulb circuit, and a moveable bar magnet. There are controls that change what is connected to the circuit,  flip the bar magnet, and reset the sim.'
    },

    // magnet description in summary
    moveMagnetToPlay: {
      value: 'Move the magnet to play.'
    },

    // headings
    lightBulbCircuitLabel: {
      value: 'Light Bulb Circuit'
    },
    barMagnet: {
      value: 'Bar Magnet'
    },
    controls: {
      value: 'Controls Area'
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
    coilsStaticDescription: {
      value: 'The coils are open on the left and right - the bar magnet to pass through.'
    },
    voltmeter: {
      value: 'Voltmeter'
    },
    circuitFourCoilOnly: {
      value: 'In circuit are a light bulb and 4 loop coil. The coil is open on the left and right - the bar magnet can pass through.'
    },
    lightbulbCircuitPattern: {
      value: 'The light bulb circuit has a {{loops}} coil connected. {{coils}} open on the left and right, allowing the bar magnet to pass through.'
    },
    voltMeterAttached: {
      value: 'A volt meter is also attached to the circuit.'
    },
    aLightbulb: {
      value: 'a lightbulb'
    },
    aVoltMeter: {
      value: 'a volt meter'
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
    circuitHasPatternString: {
      value: 'Circuit now has {{coil}}.'
    },
    oneCoil: {
      value: 'one coil'
    },
    twoCoils: {
      value: 'two coils'
    },

    /*************************************
     * Magnet Descriptions and Help Text *
     *************************************/

     // polarity
     magnetPolarity: {
       value: 'Magnet polarity:'
     },
     poleOnThePattern: {
       value: '{{pole}} pole on the {{side}}'
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
       value: 'Magnet sliding {{speed}} to the {{direction}}. Press Space to stop slide.'
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
    barMagnetPositionPattern: {
      value: 'The bar magnet is {{areaPosition}}'
    },
    barMagnetIs: {
      value: 'The bar magnet is:'
    },
    positionOfPlayAreaPattern: {
      value: 'at the {{position}} of the Play Area.'
    },
    magnetLocationAlertPattern: {
      value: 'Magnet at {{position}} of Play Area'
    },
    magnetLocationExtraAlertPattern: {
      value: 'Magnet at {{position}} of Play Area. W A S D keys moves magnet.'
    },
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

    /********************************
     * Magnet coil proximity values *
     ********************************/
    in: {
      value: 'in'
    },
    farFrom: {
      value: 'far from'
    },
    closeTo: {
      value: 'close to'
    },
    veryCloseTo: {
      value: 'very close to'
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
      value: '{{proximity}} 4-loop coil.'
    },
    proximityToTwoCoilPattern: {
      value: '{{proximity}} 2-loop coil.'
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
     * Control Panel Descriptions, Help Text, and Alerts *
     *****************************************************/
    showingFieldLines: {
      value: 'Showing magnetic field lines.'
    },
    hideFieldLines: {
      value: 'Hiding magnetic field lines.'
    },
    connectingVoltmeter: {
      value: 'Connecting voltmeter to circuit.'
    },
    removingVoltmeter: {
      value: 'Removing voltmeter from circuit.'
    },
    flippingMagnetPattern: {
      value: 'Flipping magnet: North pole is now on {{northSide}}. South pole now on {{southSide}}.'
    },
    flippingMagnetAndFieldPattern: {
      value: 'Flipping magnet and its magnetic field: North pole is now on {{northSide}}. South pole now on {{southSide}}.'
    },
    circuitMode: {
      value: 'Circuit Mode'
    },
    connectVoltmeterToCircuit: {
      value: 'Connect voltmeter to circuit'
    },
    showFieldLabel: {
      value: 'Show field'
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
