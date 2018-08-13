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
    sceneSummary: {
      value: 'Faraday\'s Law is an interactive sim. It changes as you play with it.'
    },
    summaryDescription: {
      value: 'The play area has a light bulb circuit, and a moveable bar magnet. There are controls that change what is connected to the circuit,  flip the bar magnet, and reset the sim.'
    },
    controls: {
      value: 'Controls:'
    },
    inTheCircuit: {
      value: 'In circuit are a:'
    },
    coilsStaticDescription: {
      value: 'The coils are open on the left and right - the bar magnet to pass through.'
    },
    moveMagnetToPlay: {
      value: 'Move the magnet to play.'
    },
    lightBulbCircuitLabel: {
      value: 'Light Bulb Circuit'
    },
    barMagnet: {
      value: 'Bar Magnet'
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
      value: 'A volt meter attached is also attached to the circuit.'
    },
    aLightbulb: {
      value: 'a lightbulb'
    },
    aVoltMeter: {
      value: 'a volt meter'
    },
    aNumberLoopPattern: {
      value: 'a {{number}} loop'
    },
    theNumberLoopPattern: {
      value: 'the {{number}} loop'
    },
    aLoopCoilPattern: {
      value: 'a {{loops}} coil'
    },
    theLoopCoilPattern: {
      value: 'the {{loops}} coil'
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
    twoWordsCommaPattern: {
      value: '{{first}}, {{second}}'
    },
    a: {
      value: 'a'
    },
    and: {
      value: 'and'
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
    barMagnetPositionPattern: {
      value: 'The bar magnet is {{areaPosition}}'
    },
    barMagnetIs: {
      value: 'The bar magnet is:'
    },
    magnetPolarity: {
      value: 'Magnet polarity:'
    },
    positionOfPlayAreaPattern: {
      value: 'at the {{position}} of the Play Area.'
    },
    poleOnThePattern: {
      value: '{{pole}} pole on the {{side}}'
    },
    fieldLines: {
      value: 'Field Lines'
    },
    fieldLinesDescriptionPattern: {
      value: 'Magnetic field lines go around from North end on {{northSide}} side of magnet, to South end on {{southSide}} side of magnet.'
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
    north: {
      value: 'North'
    },
    south: {
      value: 'South'
    },
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
    magnetLocationAlertPattern: {
      value: 'Magnet at {{position}} of Play Area'
    },
    magnetLocationExtraAlertPattern: {
      value: 'Magnet at {{position}} of Play Area. W A S D keys moves magnet. Number 1, 2, or 3 keys slides magnet.'
    },
    slidingStoppedPattern: {
      value: 'Sliding stopped. Magnet at {{position}} of play area'
    },
    stepDirectionPattern: {
      value: '{{stepSize}} step {{stepDirection}}'
    },
    up: {
      value: 'up'
    },
    down: {
      value: 'down'
    },
    left: {
      value: 'left'
    },
    right: {
      value: 'right'
    },
    upAndLeft: {
      value: 'up and left'
    },
    upAndRight: {
      value: 'up and right'
    },
    downAndLeft: {
      value: 'down and left'
    },
    downAndRight: {
      value: 'down and right'
    },
    regular: {
      value: 'regular'
    },
    large: {
      value: 'large'
    },
    small: {
      value: 'small'
    },
    fieldStrengthPassingPattern: {
      value: ' {{fieldStrength}} magnetic field passing through.'
    },

    fieldStrengthPassingCoilPattern: {
      value: '{{strength}} magnetic field passing through {{coil}}.'
    },
    fieldStrengthPassingBothCoilsPattern: {
      value: '{{strength}} magnetic field passing through both 4 loop and 2 loop coils.'
    },
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
    circuitHasPatternString: {
      value: 'Circuit now has {{coil}}.'
    },
    oneCoil: {
      value: 'one coil'
    },
    twoCoils: {
      value: 'two coils'
    },
    flippingMagnetPattern: {
      value: 'Flipping magnet: North pole is now on {{northSide}}. South pole now on {{southSide}}.'
    },
    flippingMagnetAndFieldPattern: {
      value: 'Flipping magnet and its magnetic field: North pole is now on {{northSide}}. South pole now on {{southSide}}.'
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
    slowly: {
      value: 'slowly'
    },
    normally: {
      value: 'normally'
    },
    quickly: {
      value: 'quickly'
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
    magnetSlidingAlertPattern: {
      value: 'Magnet sliding {{speed}} to the {{direction}}. Press Space to stop slide.'
    },
    bumpingCoilPattern: {
      value: 'Bumping {{coil}} coil'
    }
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( FaradaysLawA11yStrings ); }

  faradaysLaw.register( 'FaradaysLawA11yStrings', FaradaysLawA11yStrings );

  return FaradaysLawA11yStrings;
} );
