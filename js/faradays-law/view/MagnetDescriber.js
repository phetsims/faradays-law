// Copyright 2018-2020, University of Colorado Boulder

/**
 *
 * Handles the logic of mapping the position of a Node (via its bounds) to a specified region in the sim. This map is
 * divided into 9 evenly divided regions.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import faradaysLaw from '../../faradaysLaw.js';
import faradaysLawStrings from '../../faradays-law-strings.js';
import OrientationEnum from '../model/OrientationEnum.js';
import CoilTypeEnum from './CoilTypeEnum.js';

// strings
const topLeftString = faradaysLawStrings.a11y.topLeft;
const topCenterString = faradaysLawStrings.a11y.topCenter;
const topRightString = faradaysLawStrings.a11y.topRight;
const middleLeftString = faradaysLawStrings.a11y.middleLeft;
const centerString = faradaysLawStrings.a11y.center;
const middleRightString = faradaysLawStrings.a11y.middleRight;
const bottomLeftString = faradaysLawStrings.a11y.bottomLeft;
const bottomCenterString = faradaysLawStrings.a11y.bottomCenter;
const bottomRightString = faradaysLawStrings.a11y.bottomRight;
const edgeString = faradaysLawStrings.a11y.edge;
const twoWordsPatternString = faradaysLawStrings.a11y.twoWordsPattern;

const barMagnetPositionPatternString = faradaysLawStrings.a11y.barMagnetPositionPattern;
const positionOfPlayAreaPatternString = faradaysLawStrings.a11y.positionOfPlayAreaPattern;
const barMagnetHelpTextString = faradaysLawStrings.a11y.barMagnetHelpText;
const inString = faradaysLawStrings.a11y.in;
const veryCloseToString = faradaysLawStrings.a11y.veryCloseTo;
const closeToString = faradaysLawStrings.a11y.closeTo;
const farFromString = faradaysLawStrings.a11y.farFrom;
const touchingSideOfCoilPatternString = faradaysLawStrings.a11y.touchingSideOfCoilPattern;
const magnetPositionProximityPatternString = faradaysLawStrings.a11y.magnetPositionProximityPattern;

// magnet alert patterns
const slidingAndPositionFourCoilPatternString = faradaysLawStrings.a11y.slidingAndPositionFourCoilPattern;
const slidingStoppedPositionPatternString = faradaysLawStrings.a11y.slidingStoppedPositionPattern;
const fourCoilTwoCoilFieldLinesPatternString = faradaysLawStrings.a11y.fourCoilTwoCoilFieldLinesPattern;
const twoCoilFieldLinesPatternString = faradaysLawStrings.a11y.twoCoilFieldLinesPattern;
const slidingStoppedPositionFourCoilTwoCoilFieldLinesPatternString = faradaysLawStrings.a11y.slidingStoppedPositionFourCoilTwoCoilFieldLinesPattern;

const poleOnThePatternString = faradaysLawStrings.a11y.poleOnThePattern;
const northString = faradaysLawStrings.a11y.north;
const southString = faradaysLawStrings.a11y.south;

const leftString = faradaysLawStrings.a11y.left;
const rightString = faradaysLawStrings.a11y.right;

const minimalString = faradaysLawStrings.a11y.minimal;
const veryWeakString = faradaysLawStrings.a11y.veryWeak;
const weakString = faradaysLawStrings.a11y.weak;
const strongString = faradaysLawStrings.a11y.strong;
const veryStrongString = faradaysLawStrings.a11y.veryStrong;

const fieldLinesDescriptionPatternString = faradaysLawStrings.a11y.fieldLinesDescriptionPattern;
const fourLoopOnlyFieldStrengthPatternString = faradaysLawStrings.a11y.fourLoopOnlyFieldStrengthPattern;
const fieldStrengthPatternString = faradaysLawStrings.a11y.fieldStrengthPattern;

const fourLoopCoilString = faradaysLawStrings.a11y.fourLoopCoil;
const twoLoopCoilString = faradaysLawStrings.a11y.twoLoopCoil;
const theCoilPatternString = faradaysLawStrings.a11y.theCoilPattern;
const theFourLoopCoilString = StringUtils.fillIn( theCoilPatternString, { coil: fourLoopCoilString } );
const theTwoLoopCoilString = StringUtils.fillIn( theCoilPatternString, { coil: twoLoopCoilString } );
const circuitNowHasPatternString = faradaysLawStrings.a11y.circuitNowHasPattern;
const oneCoilString = faradaysLawStrings.a11y.oneCoil;
const twoCoilsString = faradaysLawStrings.a11y.twoCoils;

const magnetLocationAlertPatternString = faradaysLawStrings.a11y.magnetLocationAlertPattern;
const magnetLocationExtraAlertPatternString = faradaysLawStrings.a11y.magnetLocationExtraAlertPattern;

const slidingStoppedString = faradaysLawStrings.a11y.slidingStopped;
const magnetSlidingAlertPatternString = faradaysLawStrings.a11y.magnetSlidingAlertPattern;

const connectedString = faradaysLawStrings.a11y.connected;
const removedString = faradaysLawStrings.a11y.removed;
const voltmeterAlertPatternString = faradaysLawStrings.a11y.voltmeterAlertPattern;
const fieldStrengthPassingCoilPatternString = faradaysLawStrings.a11y.fieldStrengthPassingCoilPattern;
const fieldStrengthPassingBothCoilsPatternString = faradaysLawStrings.a11y.fieldStrengthPassingBothCoilsPattern;
const fieldLinesVisibilityPatternString = faradaysLawStrings.a11y.fieldLinesVisibilityPattern;
const hiddenString = faradaysLawStrings.a11y.hidden;
const visibleString = faradaysLawStrings.a11y.visible;
const fieldLinesDescriptionUpdatedString = faradaysLawStrings.a11y.fieldLinesDescriptionUpdated;

const flippingMagnetPatternString = faradaysLawStrings.a11y.flippingMagnetPattern;

const proximityToFourCoilPatternString = faradaysLawStrings.a11y.proximityToFourCoilPattern;
const proximityToTwoCoilPatternString = faradaysLawStrings.a11y.proximityToTwoCoilPattern;

const bumpingCoilPatternString = faradaysLawStrings.a11y.bumpingCoilPattern;
const singleCoilDescriptionString = faradaysLawStrings.a11y.singleCoilDescription;
const doubleCoilDescriptionString = faradaysLawStrings.a11y.doubleCoilDescription;
const circuitFourCoilOnlyString = faradaysLawStrings.a11y.circuitFourCoilOnly;
const circuitFourCoilAndVoltmeterString = faradaysLawStrings.a11y.circuitFourCoilAndVoltmeter;
const circuitDescriptionPatternString = faradaysLawStrings.a11y.circuitDescriptionPattern;

// constants
const REGION_DESCRIPTIONS = [ topLeftString, topCenterString, topRightString,
  middleLeftString, centerString, middleRightString,
  bottomLeftString, bottomCenterString, bottomRightString ];

// can create a linear function to map distances to integers 0 - 2
const PROXIMITY_STRINGS = [ inString, veryCloseToString, closeToString, farFromString ];
// const proximityMapFunction = new LinearFunction( 95, 260, 0, 2, true ); // determined empirically from sim testing

const FIELD_STRENGTHS = [ minimalString, veryWeakString, weakString, strongString, veryStrongString ];
const DIRECTIONS = { LEFT: leftString, RIGHT: rightString };

class MagnetDescriber {

  constructor( model, regionManager ) {
    // @private
    this._model = model;
    this._bounds = model.bounds;
    this._magnet = model.magnet;
    this._topCoil = model.topCoil;
    this._bottomCoil = model.bottomCoil;

    // @public
    this.regionManager = regionManager;
  }

  magnetMovedAlertText() {
    let slidingAndPositionPhrase = null;
    let alertText = this.fourCoilProximityString;
    let twoCoilFieldLines = null;

    if ( this.regionManager.magnetStoppedByKeyboard ) {
      slidingAndPositionPhrase = slidingStoppedString;
    }

    if ( !this.regionManager.magnetInOrVeryCloseToCoil ) {
      if ( slidingAndPositionPhrase ) {
        // phrase exists, magnet stopped by keyboard
        const pattern = {
          slidingStopped: slidingStoppedString,
          magnetPosition: this.magnetLocationAlertText
        };
        slidingAndPositionPhrase = StringUtils.fillIn( slidingStoppedPositionPatternString, pattern );
      }
      else {
        slidingAndPositionPhrase = this.magnetLocationAlertText;
      }
    }

    if ( this._model.topCoilVisibleProperty.get() ) {
      // both coils visible
      twoCoilFieldLines = this.twoCoilProximityString;
    }

    if ( this._magnet.fieldLinesVisibleProperty.get() ) {
      if ( twoCoilFieldLines ) {
        const pattern = {
          twoCoil: twoCoilFieldLines,
          fieldLines: fieldLinesDescriptionUpdatedString
        };
        twoCoilFieldLines = StringUtils.fillIn( twoCoilFieldLinesPatternString, pattern );
      }
      else {
        twoCoilFieldLines = fieldLinesDescriptionUpdatedString;
      }
    }

    if ( slidingAndPositionPhrase && twoCoilFieldLines ) {
      alertText = StringUtils.fillIn(
        slidingStoppedPositionFourCoilTwoCoilFieldLinesPatternString,
        {
          slidingAndPositionPhrase: slidingAndPositionPhrase,
          twoCoilFieldLines: twoCoilFieldLines,
          fourCoil: this.fourCoilProximityString
        }
      );
    }
    else if ( slidingAndPositionPhrase ) {
      alertText = StringUtils.fillIn(
        slidingAndPositionFourCoilPatternString,
        {
          slidingAndPositionPhrase: slidingAndPositionPhrase,
          fourCoil: this.fourCoilProximityString
        }
      );
    }
    else if ( twoCoilFieldLines ) {
      alertText = StringUtils.fillIn(
        fourCoilTwoCoilFieldLinesPatternString,
        {
          fourCoil: this.fourCoilProximityString,
          twoCoilFieldLines: twoCoilFieldLines
        }
      );
    }

    return alertText;
  }

  getBumpingCoilString( coil ) {
    return StringUtils.fillIn( bumpingCoilPatternString, { coil: coil } );
  }

  getFlipMagnetAlertText( orientation ) {
    let northSide = leftString;
    let southSide = rightString;
    const alertPattern = flippingMagnetPatternString;

    if ( orientation === OrientationEnum.SN ) {
      northSide = rightString;
      southSide = leftString;
    }

    let alert = StringUtils.fillIn( alertPattern, { northSide: northSide, southSide: southSide } );

    if ( this._model.magnet.fieldLinesVisibleProperty.get() ) {
      alert += ' ' + fieldLinesDescriptionUpdatedString;
    }

    return alert;
  }

  get strengthThroughFourCoilText() {
    const strength = FIELD_STRENGTHS[ this.regionManager.getBottomCoilFieldStrengthRegion() ];
    return StringUtils.fillIn( fieldStrengthPassingCoilPatternString, {
      strength: strength,
      coil: theFourLoopCoilString
    } );
  }

  get strengthThroughTwoCoilText() {
    const strength = FIELD_STRENGTHS[ this.regionManager.getTopCoilFieldStrengthRegion() ];
    return StringUtils.fillIn( fieldStrengthPassingCoilPatternString, {
      strength: strength,
      coil: theTwoLoopCoilString
    } );
  }

  get strengthThroughBothCoilsText() {
    const strength = FIELD_STRENGTHS[ this.regionManager.getTopCoilFieldStrengthRegion() ];
    return StringUtils.fillIn( fieldStrengthPassingBothCoilsPatternString, { strength: strength } );
  }

  get magnetLocationAlertText() {
    return StringUtils.fillIn( magnetLocationAlertPatternString, { position: this.positionString } );
  }

  // get magnetFocusAlertText() {
  //   var position = this.positionString;
  //   var pattern = this.regionManager.showExtraMoveText ? magnetLocationAlertPatternString : magnetLocationExtraAlertPatternString;
  //   return StringUtils.fillIn( pattern, { position: position } );
  // }

  get magnetFocusAlertText() {
    const pattern = this.regionManager.showExtraMoveText ? magnetLocationExtraAlertPatternString : magnetLocationAlertPatternString;
    return StringUtils.fillIn( pattern, { position: this.positionString } );
  }

  get fieldLinesDescription() {
    const northSide = this._magnet.orientationProperty.get() === OrientationEnum.NS ? leftString : rightString;
    const southSide = this._magnet.orientationProperty.get() === OrientationEnum.SN ? leftString : rightString;
    return StringUtils.fillIn( fieldLinesDescriptionPatternString, { northSide: northSide, southSide: southSide } );
  }

  get fourLoopOnlyFieldStrength() {
    const valueString = FIELD_STRENGTHS[ this.regionManager.getFieldStrengthAtCoilRegion( this._bottomCoil ) ];
    return StringUtils.fillIn( fourLoopOnlyFieldStrengthPatternString, { fieldStrength: valueString } );
  }

  get fourLoopFieldStrength() {
    return this.getFieldStrengthAtCoil( this._bottomCoil );
  }

  get twoLoopFieldStrength() {
    return this.getFieldStrengthAtCoil( this._topCoil );
  }

  getFieldStrengthAtCoil( coil ) {
    const fieldStrengthString = FIELD_STRENGTHS[ this.regionManager.getFieldStrengthAtCoilRegion( coil ) ];
    const coilString = coil === this._topCoil ? theTwoLoopCoilString : theFourLoopCoilString;
    return StringUtils.fillIn(
      fieldStrengthPatternString,
      {
        fieldStrength: fieldStrengthString,
        coil: coilString
      } );
  }

  get fourCoilOnlyPolarityDescription() {
    const pattern = '{{first}}, {{second}}';
    return StringUtils.fillIn( pattern, { first: this.northPoleSideString, second: this.southPoleSideString } );
  }

  get northPoleSideString() {
    return this.getPoleSideString( northString, OrientationEnum.NS );
  }

  get southPoleSideString() {
    return this.getPoleSideString( southString, OrientationEnum.SN );
  }

  getPoleSideString( pole, orientation ) {
    const side = this._magnet.orientationProperty.get() === orientation ? leftString : rightString;
    return StringUtils.fillIn( poleOnThePatternString, { pole: pole, side: side } );
  }

  get fourLoopOnlyMagnetPosition() {
    const touchingCoil = this.regionManager.getTouchingCoil();
    const magnetPosition = StringUtils.fillIn( barMagnetPositionPatternString, { areaPosition: this.positionOfPlayAreaString } );
    const coilProximity = this.fourCoilProximityString;

    if ( this.regionManager.magnetInCoil ) {
      return coilProximity;
    }

    if ( touchingCoil >= 0 && !this.regionManager.magnetInCoil ) {
      return StringUtils.fillIn( touchingSideOfCoilPatternString, touchingCoil );
    }
    return StringUtils.fillIn( magnetPositionProximityPatternString, {
      magnetPosition: magnetPosition,
      coilProximity: coilProximity
    } );
  }

  get positionOfPlayAreaString() {
    return StringUtils.fillIn( positionOfPlayAreaPatternString, { position: this.positionString } );
  }

  get barMagnetHelpText() {
    return barMagnetHelpTextString;
  }

  // handles getting the current position description (e.g. top-left edge, bottom-center, center, etc...)
  get positionString() {
    let description = REGION_DESCRIPTIONS[ this.regionManager.positionRegion ];
    if ( this.regionManager.magnetAtEdge ) {
      description = StringUtils.fillIn( twoWordsPatternString, { first: description, second: edgeString } );
    }

    return description;
  }

  get fourCoilProximityString() {

    // if ( this.regionManager.magnetInCoil ) {
    //   return th
    // }
    const proximity = PROXIMITY_STRINGS[ this.regionManager.magnetToBottomCoilProximity ];

    return this.getCoilProximityString( proximity, CoilTypeEnum.FOUR_COIL );
  }

  get twoCoilProximityString() {
    const proximity = PROXIMITY_STRINGS[ this.regionManager.magnetToTopCoilProximity ];

    return this.getCoilProximityString( proximity, CoilTypeEnum.TWO_COIL );
  }

  getCoilProximityString( proximity, coil ) {
    const pattern = coil === CoilTypeEnum.FOUR_COIL ? proximityToFourCoilPatternString : proximityToTwoCoilPatternString;
    const { adjacentCoil, magnetInCoil } = this.regionManager;
    let coilDirection = '.';
    if ( adjacentCoil === coil && !magnetInCoil ) {
      coilDirection = this.regionManager.magnetScreenSide === 'left' ? ' to the right.' : ' to the left.';
    }

    return StringUtils.fillIn( pattern, { proximity: proximity ? proximity : '' } ) + coilDirection;
  }

  static getMagnetSlidingAlertText( speedValue, directionValue ) {
    const direction = DIRECTIONS[ directionValue ];
    return StringUtils.fillIn( magnetSlidingAlertPatternString, { direction: direction } );
  }

  static getFieldLinesVisibilityAlertText( showLines ) {
    const visibility = showLines ? visibleString : hiddenString;
    let alert = StringUtils.fillIn( fieldLinesVisibilityPatternString, { visibility: visibility } );

    if ( showLines ) {
      alert += ' ' + fieldLinesDescriptionUpdatedString;
    }

    return alert;
  }

  /*******************************************
   * CIRCUIT DESCRIPTION AND ALERT FUNCTIONS *
   *******************************************/

  static getVoltmeterAttachmentAlertText( showVoltmeter ) {
    const attachmentState = showVoltmeter ? connectedString : removedString;
    return StringUtils.fillIn( voltmeterAlertPatternString, { attachmentState: attachmentState } );
  }

  static getCoilConnectionAlertText( showTopCoil ) {
    const coil = showTopCoil ? twoCoilsString : oneCoilString;
    return StringUtils.fillIn( circuitNowHasPatternString, { coil: coil } );
  }

  static getCoilDescription( showTopCoil ) {
    return showTopCoil ? doubleCoilDescriptionString : singleCoilDescriptionString;
  }

  static getFourCoilOnlyDescription( showVoltmeter ) {
    const circuitContents = showVoltmeter ? circuitFourCoilAndVoltmeterString : circuitFourCoilOnlyString;
    const coilDescription = singleCoilDescriptionString;
    return StringUtils.fillIn( circuitDescriptionPatternString, {
      circuitContents: circuitContents,
      coilDescription: coilDescription
    } );
  }
}

faradaysLaw.register( 'MagnetDescriber', MagnetDescriber );
export default MagnetDescriber;