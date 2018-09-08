// Copyright 2018, University of Colorado Boulder

/**
 *
 * Handles the logic of mapping the position of a Node (via its bounds) to a specified region in the sim. This map is
 * divided into 9 evenly divided regions.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  // var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  // var Vector2 = require( 'DOT/Vector2' );
  // var Bounds2 = require( 'DOT/Bounds2' );
  // var LinearFunction = require( 'DOT/LinearFunction' );
  // var MagnetDirectionEnum = require( 'FARADAYS_LAW/faradays-law/model/MagnetDirectionEnum' );
  // var MagnetRegionManager = require( 'FARADAYS_LAW/faradays-law/view/MagnetRegionManager' );
  var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  // var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // var Util = require( 'DOT/Util' );
  // var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  // var Vector2 = require( 'DOT/Vector2' );

  // strings
  var topLeftString = FaradaysLawA11yStrings.topLeft.value;
  var topCenterString = FaradaysLawA11yStrings.topCenter.value;
  var topRightString = FaradaysLawA11yStrings.topRight.value;
  var middleLeftString = FaradaysLawA11yStrings.middleLeft.value;
  var centerString = FaradaysLawA11yStrings.center.value;
  var middleRightString = FaradaysLawA11yStrings.middleRight.value;
  var bottomLeftString = FaradaysLawA11yStrings.bottomLeft.value;
  var bottomCenterString = FaradaysLawA11yStrings.bottomCenter.value;
  var bottomRightString = FaradaysLawA11yStrings.bottomRight.value;
  var edgeString = FaradaysLawA11yStrings.edge.value;
  var twoWordsPatternString = FaradaysLawA11yStrings.twoWordsPattern.value;
  // var threeWordsPatternString = FaradaysLawA11yStrings.threeWordsPattern.value;
  // var twoItemPatternString = FaradaysLawA11yStrings.twoItemPattern.value;

  var barMagnetPositionPatternString = FaradaysLawA11yStrings.barMagnetPositionPattern.value;
  var positionOfPlayAreaPatternString = FaradaysLawA11yStrings.positionOfPlayAreaPattern.value;
  var inString = FaradaysLawA11yStrings.in.value;
  var veryCloseToString = FaradaysLawA11yStrings.veryCloseTo.value;
  var closeToString = FaradaysLawA11yStrings.closeTo.value;
  var farFromString = FaradaysLawA11yStrings.farFrom.value;

  var poleOnThePatternString = FaradaysLawA11yStrings.poleOnThePattern.value;
  var northString = FaradaysLawA11yStrings.north.value;
  var southString = FaradaysLawA11yStrings.south.value;

  var leftString = FaradaysLawA11yStrings.left.value;
  var rightString = FaradaysLawA11yStrings.right.value;

  var minimalString = FaradaysLawA11yStrings.minimal.value;
  var veryWeakString = FaradaysLawA11yStrings.veryWeak.value;
  var weakString = FaradaysLawA11yStrings.weak.value;
  var strongString = FaradaysLawA11yStrings.strong.value;
  var veryStrongString = FaradaysLawA11yStrings.veryStrong.value;

  var fieldLinesDescriptionPatternString = FaradaysLawA11yStrings.fieldLinesDescriptionPattern.value;
  var fourLoopOnlyFieldStrengthPatternString = FaradaysLawA11yStrings.fourLoopOnlyFieldStrengthPattern.value;
  var fieldStrengthPatternString = FaradaysLawA11yStrings.fieldStrengthPattern.value;

  var fourLoopCoilString = FaradaysLawA11yStrings.fourLoopCoil.value;
  var twoLoopCoilString = FaradaysLawA11yStrings.twoLoopCoil.value;
  var theCoilPatternString = FaradaysLawA11yStrings.theCoilPattern.value;
  var theFourLoopCoilString = StringUtils.fillIn( theCoilPatternString, { coil: fourLoopCoilString } );
  var theTwoLoopCoilString = StringUtils.fillIn( theCoilPatternString, { coil: twoLoopCoilString } );

  var magnetLocationAlertPatternString = FaradaysLawA11yStrings.magnetLocationAlertPattern.value;
  var magnetLocationExtraAlertPatternString = FaradaysLawA11yStrings.magnetLocationExtraAlertPattern.value;

  var slidingStoppedString = FaradaysLawA11yStrings.slidingStopped.value;

  // var regularString = FaradaysLawA11yStrings.regular.value;
  // var smallString = FaradaysLawA11yStrings.small.value;
  // var largeString = FaradaysLawA11yStrings.large.value;
  // var stepDirectionPatternString = FaradaysLawA11yStrings.stepDirectionPattern.value;

  // var fieldStrengthPassingPatternString = FaradaysLawA11yStrings.fieldStrengthPassingPattern.value;
  var fieldStrengthPassingCoilPatternString = FaradaysLawA11yStrings.fieldStrengthPassingCoilPattern.value;
  var fieldStrengthPassingBothCoilsPatternString = FaradaysLawA11yStrings.fieldStrengthPassingBothCoilsPattern.value;
  var showingFieldLinesString = FaradaysLawA11yStrings.showingFieldLines.value;
  var hideFieldLinesString = FaradaysLawA11yStrings.hideFieldLines.value;
  var fieldLinesDescripitonUpdatedString = FaradaysLawA11yStrings.fieldLinesDescriptionUpdated.value;

  var flippingMagnetPatternString = FaradaysLawA11yStrings.flippingMagnetPattern.value;
  var flippingMagnetAndFieldPatternString = FaradaysLawA11yStrings.flippingMagnetAndFieldPattern.value;

  // var exitingCoilPatternString = FaradaysLawA11yStrings.exitingCoilPattern.value;
  // var noCoilPatternString = FaradaysLawA11yStrings.noCoilPattern.value;
  // var coilToDirectionPatternString = FaradaysLawA11yStrings.coilToDirectionPattern.value;
  // var proximityToFourCoilPatternString = FaradaysLawA11yStrings.proximityToFourCoilPattern.value;
  // var proximityToTwoCoilPatternString = FaradaysLawA11yStrings.proximityToTwoCoilPattern.value;
  // var slowlyString = FaradaysLawA11yStrings.slowly.value;

  var bumpingCoilPatternString = FaradaysLawA11yStrings.bumpingCoilPattern.value;

  // constants
  var REGION_DESCRIPTIONS = [ topLeftString,    topCenterString,    topRightString,
                              middleLeftString, centerString,       middleRightString,
                              bottomLeftString, bottomCenterString, bottomRightString ];

  // can create a linear function to map distances to integers 0 - 2
  var PROXIMITY_STRINGS = [ inString, veryCloseToString, closeToString, farFromString ];
  // var proximityMapFunction = new LinearFunction( 95, 260, 0, 2, true ); // determined empirically from sim testing

  var FIELD_STRENGTHS = [ minimalString, veryWeakString, weakString, strongString, veryStrongString ];

  class MagnetDescriber {

    constructor( model, regionManager, tandem ) {
      // @private
      this._model = model;
      this._bounds = model.bounds;
      this._magnet = model.magnet;
      this._topCoil = model.topCoil;
      this._bottomCoil = model.bottomCoil;

      // @public
      this.regionManager = regionManager;

      model.magnet.fieldLinesVisibleProperty.lazyLink( showLines => {
        const utterance = this.getShowFieldLinesAlertText( showLines );
        utteranceQueue.addToBack( utterance );
      } );
    }

    magnetMovedAlertText() {
      let alertStringList = [];

      if ( this.regionManager._magnetStoppedByKeyboard ) {
        alertStringList.push( slidingStoppedString );
      }

      alertStringList.push( this.magnetLocationAlertText );  // magnet at {{position}} of play area.
      alertStringList.push( this.fourCoilProximityString );

      if ( this._model.topCoilVisibleProperty.get() ) {
        // both coils visible
        alertStringList.push( this.twoCoilProximityString );
      }

      if ( this._magnet.fieldLinesVisibleProperty.get() ) {
        alertStringList.push( fieldLinesDescripitonUpdatedString );
      }

      return alertStringList.join( ' ' );
    }

    getBumpingCoilString( coil ) {
      return StringUtils.fillIn( bumpingCoilPatternString, { coil } );
    }

    getFlipMagnetAlertText( orientation ) {
      let northSide = leftString;
      let southSide = rightString;
      let alertPattern = this._magnet.fieldLinesVisibleProperty.get() ?
                         flippingMagnetAndFieldPatternString :
                         flippingMagnetPatternString;

      if ( orientation === OrientationEnum.SN ) {
        northSide = rightString;
        southSide = leftString;
      }

      return StringUtils.fillIn( alertPattern, { northSide, southSide } );
    }

    getShowFieldLinesAlertText( showLines ) {

      var strArray = [ showingFieldLinesString ];

      if ( !this._model.topCoilVisibleProperty.get() ) {
        strArray.push( this.strengthThroughFourCoilText );
      } else {
        var topStrength = this.regionManager.getTopCoilFieldStrengthRegion();
        var bottomStrength = this.regionManager.getBottomCoilFieldStrengthRegion();

        if ( topStrength !== bottomStrength ) {
          strArray.push( this.strengthThroughFourCoilText, this.strengthThroughTwoCoilText );
        } else {
          strArray.push( this.strengthThroughBothCoilsText );
        }
      }

      return showLines ? strArray.join( ' ' ) : hideFieldLinesString;
    }

    get strengthThroughFourCoilText() {
      let strength = FIELD_STRENGTHS[ this.regionManager.getBottomCoilFieldStrengthRegion() ];
      return StringUtils.fillIn( fieldStrengthPassingCoilPatternString, { strength: strength, coil: theFourLoopCoilString } );
    }

    get strengthThroughTwoCoilText() {
      let strength = FIELD_STRENGTHS[ this.regionManager.getTopCoilFieldStrengthRegion() ];
      return StringUtils.fillIn( fieldStrengthPassingCoilPatternString, { strength: strength, coil: theTwoLoopCoilString } );
    }

    get strengthThroughBothCoilsText() {
      let strength = FIELD_STRENGTHS[ this.regionManager.getTopCoilFieldStrengthRegion() ];
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
      var northSide = this._magnet.orientationProperty.get() === OrientationEnum.NS ? leftString : rightString;
      var southSide = this._magnet.orientationProperty.get() === OrientationEnum.SN ? leftString : rightString;
      return StringUtils.fillIn( fieldLinesDescriptionPatternString, { northSide: northSide, southSide: southSide } );
    }

    get fourLoopOnlyFieldStrength() {
      var valueString = FIELD_STRENGTHS[ this.regionManager.getFieldStrengthAtCoilRegion( this._bottomCoil ) ];
      return StringUtils.fillIn( fourLoopOnlyFieldStrengthPatternString, { fieldStrength: valueString } );
    }

    get fourLoopFieldStrength() {
      return this.getFieldStrengthAtCoil( this._bottomCoil );
    }

    get twoLoopFieldStrength() {
      return this.getFieldStrengthAtCoil( this._topCoil );
    }

    getFieldStrengthAtCoil( coil ) {
      var fieldStrengthString = FIELD_STRENGTHS[ this.regionManager.getFieldStrengthAtCoilRegion( coil ) ];
      var coilString = coil === this._topCoil ? theTwoLoopCoilString : theFourLoopCoilString;
      return StringUtils.fillIn(
        fieldStrengthPatternString,
        {
          fieldStrength: fieldStrengthString,
          coil: coilString
        } );
    }

    mapFieldStrengthToInteger( fieldStrength ) {
      if ( this._bottomCoil.position.distance( this._magnet.positionProperty.get() ) < 70 ) {
          return 4;
      }
      if ( fieldStrength < 0.025 ) {
        return 0;
      } else if ( fieldStrength >= 0.025 && fieldStrength < 0.04 ) {
        return 1;
      } else if ( fieldStrength >= 0.04 && fieldStrength < 0.075 ) {
        return 2;
      } else if ( fieldStrength >= 0.075 && fieldStrength < 0.18 ) {
        return 3;
      } else {
        return 4;
      }
    }

    get northPoleSideString() {
      return this.getPoleSideString( northString, OrientationEnum.NS );
    }

    get southPoleSideString() {
      return this.getPoleSideString( southString, OrientationEnum.SN );
    }

    getPoleSideString( poleString, orientation ) {
      var side = this._magnet.orientationProperty.get() === orientation ? leftString : rightString;
      return StringUtils.fillIn( poleOnThePatternString, { pole: poleString, side: side } );
    }

    get fourLoopOnlyMagnetPosition() {
      return StringUtils.fillIn( barMagnetPositionPatternString, { areaPosition: this.positionOfPlayAreaString } );
    }

    get positionOfPlayAreaString() {
      return StringUtils.fillIn( positionOfPlayAreaPatternString, { position: this.positionString } );
    }

    // handles getting the current position description (e.g. top-left edge, bottom-center, center, etc...)
    get positionString() {
      var description = REGION_DESCRIPTIONS[ this.regionManager.positionRegion ];
      if ( this.regionManager.magnetAtEdge ) {
        description = StringUtils.fillIn( twoWordsPatternString, { first: description, second: edgeString } );
      }

      return description;
    }

    get fourCoilProximityString() {
      const proximity = PROXIMITY_STRINGS[ this.regionManager.magnetToBottomCoilProximity ];
      const { adjacentCoil, magnetInCoil } = this.regionManager;
      let coilDirection = '';
      if ( adjacentCoil === CoilTypeEnum.FOUR_COIL && !magnetInCoil ) {
        coilDirection = this.regionManager.magnetScreenSide === 'left' ? ' to the right.' : ' to the left.';
      }
      return StringUtils.fillIn( twoWordsPatternString, { first: proximity, second: fourLoopCoilString } ) + coilDirection;
    }

    get twoCoilProximityString() {
      const proximity = PROXIMITY_STRINGS[ this.regionManager.magnetToTopCoilProximity ];
      const { adjacentCoil, magnetInCoil } = this.regionManager;
      let coilDirection = '';
      if ( adjacentCoil === CoilTypeEnum.TWO_COIL && !magnetInCoil ) {
        coilDirection = this.regionManager.magnetScreenSide === 'left' ? ' to the right.' : ' to the left.';
      }
      return StringUtils.fillIn( twoWordsPatternString, { first: proximity, second: twoLoopCoilString } ) + coilDirection;
    }
  }

  return faradaysLaw.register( 'MagnetDescriber', MagnetDescriber );
} );