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
  var inherit = require( 'PHET_CORE/inherit' );
  // var LinearFunction = require( 'DOT/LinearFunction' );
  var MagnetDirectionEnum = require( 'FARADAYS_LAW/faradays-law/model/MagnetDirectionEnum' );
  var MagnetRegions = require( 'FARADAYS_LAW/faradays-law/view/MagnetRegions' );
  var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  // var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // var Util = require( 'DOT/Util' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  var Vector2 = require( 'DOT/Vector2' );

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

  var upString = FaradaysLawA11yStrings.up.value;
  var downString = FaradaysLawA11yStrings.down.value;
  var leftString = FaradaysLawA11yStrings.left.value;
  var rightString = FaradaysLawA11yStrings.right.value;
  var upAndLeftString = FaradaysLawA11yStrings.upAndLeft.value;
  var upAndRightString = FaradaysLawA11yStrings.upAndRight.value;
  var downAndLeftString = FaradaysLawA11yStrings.downAndLeft.value;
  var downAndRightString = FaradaysLawA11yStrings.downAndRight.value;

  var minimalString = FaradaysLawA11yStrings.minimal.value;
  var veryWeakString = FaradaysLawA11yStrings.veryWeak.value;
  var weakString = FaradaysLawA11yStrings.weak.value;
  var strongString = FaradaysLawA11yStrings.strong.value;
  var veryStrongString = FaradaysLawA11yStrings.veryStrong.value;

  var fieldLinesDescriptionPatternString = FaradaysLawA11yStrings.fieldLinesDescriptionPattern.value;
  var fourLoopOnlyFieldStrengthPatternString = FaradaysLawA11yStrings.fourLoopOnlyFieldStrengthPattern.value;
  var fieldStrengthPatternString = FaradaysLawA11yStrings.fieldStrengthPattern.value;

  var theFourLoopCoilString = FaradaysLawA11yStrings.theFourLoopCoil.value;
  var theTwoLoopCoilString = FaradaysLawA11yStrings.theTwoLoopCoil.value;

  var magnetLocationAlertPatternString = FaradaysLawA11yStrings.magnetLocationAlertPattern.value;
  var magnetLocationExtraAlertPatternString = FaradaysLawA11yStrings.magnetLocationExtraAlertPattern.value;

  var slidingStoppedPatternString = FaradaysLawA11yStrings.slidingStoppedPattern.value;

  // var regularString = FaradaysLawA11yStrings.regular.value;
  // var smallString = FaradaysLawA11yStrings.small.value;
  // var largeString = FaradaysLawA11yStrings.large.value;
  // var stepDirectionPatternString = FaradaysLawA11yStrings.stepDirectionPattern.value;

  var fieldStrengthPassingPatternString = FaradaysLawA11yStrings.fieldStrengthPassingPattern.value;
  var fieldStrengthPassingCoilPatternString = FaradaysLawA11yStrings.fieldStrengthPassingCoilPattern.value;
  var fieldStrengthPassingBothCoilsPatternString = FaradaysLawA11yStrings.fieldStrengthPassingBothCoilsPattern.value;
  var showingFieldLinesString = FaradaysLawA11yStrings.showingFieldLines.value;
  var hideFieldLinesString = FaradaysLawA11yStrings.hideFieldLines.value;

  var flippingMagnetPatternString = FaradaysLawA11yStrings.flippingMagnetPattern.value;
  var flippingMagnetAndFieldPatternString = FaradaysLawA11yStrings.flippingMagnetAndFieldPattern.value;

  // constants
  var REGION_DESCRIPTIONS = [ topLeftString,    topCenterString,    topRightString,
                              middleLeftString, centerString,       middleRightString,
                              bottomLeftString, bottomCenterString, bottomRightString ];

  // var EDGE_TOLERANCE = 5;

  // can create a linear function to map distances to integers 0 - 2
  var PROXIMITY_STRINGS = [ inString, veryCloseToString, closeToString, farFromString ];
  // var proximityMapFunction = new LinearFunction( 95, 260, 0, 2, true ); // determined empirically from sim testing

  var FIELD_STRENGTHS = [ minimalString, veryWeakString, weakString, strongString, veryStrongString ];

  function MagnetDescriptions( model ) {
    var self = this;
    // @private
    this._model = model;
    this._bounds = model.bounds;
    this._magnet = model.magnet;
    this._topCoil = model.topCoil;
    this._bottomCoil = model.bottomCoil;

    this._magnetPosition = new Vector2( 0, 0 );
    this._magnetNodeBlurred = false;

    this._describeDirection = false;
    this._shiftStep = false;

    this.regionMap = new MagnetRegions( model );

    this._magnet.positionProperty.link( function( position, oldPosition ) {
      self._magnetPosition = position;
    } );

    model.showMagnetArrowsProperty.link( function( showArrows ) {
      self._magnetNodeBlurred = !showArrows;
    } );

    this.regionMap.regionChangedEmitter.addListener( ( newRegion, oldRegion ) => {
      utteranceQueue.addToBack( this.magnetLocationAlertText );
    } );

    // this.regionMap.directionChangedEmitter.addListener( direction => {
    //   // map the ENUM direction to the appropriate string
    //   let utterance = '';
    //   switch ( direction ) {
    //     case MagnetDirectionEnum.LEFT:
    //       utterance = leftString;
    //       break;
    //     case MagnetDirectionEnum.UP:
    //       utterance = upString;
    //       break;
    //     case MagnetDirectionEnum.RIGHT:
    //       utterance = rightString;
    //       break;
    //     case MagnetDirectionEnum.DOWN:
    //       utterance = downString;
    //       break;
    //     case MagnetDirectionEnum.UP_LEFT:
    //       utterance = upAndLeftString;
    //       break;
    //     case MagnetDirectionEnum.UP_RIGHT:
    //       utterance = upAndRightString;
    //       break;
    //     case MagnetDirectionEnum.DOWN_LEFT:
    //       utterance = downAndLeftString;
    //       break;
    //     case MagnetDirectionEnum.DOWN_RIGHT:
    //       utterance = downAndRightString;
    //       break;
    //     default:
    //       break;
    //   }
    //
    //   if ( this._shiftStep ) {
    //     utterance = StringUtils.fillIn( twoWordsPatternString, { first: slowlyString, second:  } );
    //   }
    //
    //   utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'direction' } ) );
    // } );

    this.regionMap.coilExitEmitter.addListener( coilType => {
      var exitingCoilPatternString = 'Exiting {{coil}}';
      var coil = coilType === CoilTypeEnum.TWO_COIL ? theTwoLoopCoilString : theFourLoopCoilString;
      var utterance = StringUtils.fillIn( exitingCoilPatternString, { coil } );
      utteranceQueue.addToBack( utterance );
    } );

    this.regionMap.coilEntranceDirectionEmitter.addListener( newCoilEntranceRegion => {
      let noCoilPatternString = 'Coil no longer to {{direction}}';
      let coilToDirectionPatternString = '{{coil}} to {{direction}}';
      let directionString = this.regionMap.coilDirection === MagnetDirectionEnum.LEFT ? leftString : rightString;

      if ( newCoilEntranceRegion === CoilTypeEnum.NO_COIL ) {
        utteranceQueue.addToBack( StringUtils.fillIn( noCoilPatternString, { direction: directionString } ) );
      } else if ( newCoilEntranceRegion === CoilTypeEnum.FOUR_COIL ) {
        utteranceQueue.addToBack( StringUtils.fillIn( coilToDirectionPatternString, { coil: theFourLoopCoilString, direction: directionString } ) );
      } else {
        utteranceQueue.addToBack( StringUtils.fillIn( coilToDirectionPatternString, { coil: theTwoLoopCoilString, direction: directionString } ) );
      }
    } );

    this.regionMap.proximityOrFieldStrengthChangedEmiter.addListener( ( bottomCoilData, topCoilData ) => {
      var bottomProxRegion = PROXIMITY_STRINGS[ bottomCoilData.proximity ];
      var topProxRegion = PROXIMITY_STRINGS[ topCoilData.proximity ];
      var bottomFSRegion = FIELD_STRENGTHS[ bottomCoilData.fieldStrength ];
      var topFSRegion = FIELD_STRENGTHS[ topCoilData.fieldStrength ];

      let bottomCoilString = StringUtils.fillIn( '{{proximity}} 4-loop coil.', { proximity: bottomProxRegion } );
      let topCoilString = StringUtils.fillIn( '{{proximity}} 2-loop coil.', { proximity: topProxRegion } );

      if ( model.magnet.showFieldLinesProperty.get() ) {
        bottomCoilString += StringUtils.fillIn( fieldStrengthPassingPatternString, { fieldStrength: bottomFSRegion } );
        topCoilString += StringUtils.fillIn( fieldStrengthPassingPatternString, { fieldStrength: topFSRegion } );
      }
      var utterance = model.showTopCoilProperty.get() ? bottomCoilString + ' ' + topCoilString : bottomCoilString;
      utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'proximityFieldStrength' } ) );
    } );

    model.magnet.showFieldLinesProperty.lazyLink( showLines => {
      var utterance = this.getShowFieldLinesAlertText( showLines );
      utteranceQueue.addToBack( utterance );
    } );
  }

  faradaysLaw.register( 'MagnetDescriptions', MagnetDescriptions );

  return inherit( Object, MagnetDescriptions, {

    getMovementDirectionText: function( direction, shiftStep ) {
      var text = '';

      switch ( direction ) {
        case MagnetDirectionEnum.LEFT:
          text = leftString;
          break;
        case MagnetDirectionEnum.UP:
          text = upString;
          break;
        case MagnetDirectionEnum.RIGHT:
          text = rightString;
          break;
        case MagnetDirectionEnum.DOWN:
          text = downString;
          break;
        case MagnetDirectionEnum.UP_LEFT:
          text = upAndLeftString;
          break;
        case MagnetDirectionEnum.UP_RIGHT:
          text = upAndRightString;
          break;
        case MagnetDirectionEnum.DOWN_LEFT:
          text = downAndLeftString;
          break;
        case MagnetDirectionEnum.DOWN_RIGHT:
          text = downAndRightString;
          break;
        default:
          break;
      }

      if ( shiftStep ) {
        text = StringUtils.fillIn( twoWordsPatternString, { first: 'slowly', second: text } );
      }

      return text;
    },

    getFlipMagnetAlertText: function( orientation ) {
      let northSide = leftString;
      let southSide = rightString;
      let alertPattern = this._magnet.showFieldLinesProperty.get() ?
                         flippingMagnetAndFieldPatternString :
                         flippingMagnetPatternString;

      if ( orientation === OrientationEnum.SN ) {
        northSide = rightString;
        southSide = leftString;
      }

      return StringUtils.fillIn( alertPattern, { northSide, southSide } );
    },

    getShowFieldLinesAlertText: function( showLines ) {

      var strArray = [ showingFieldLinesString ];

      if ( !this._model.showTopCoilProperty.get() ) {
        strArray.push( this.strengthThroughFourCoilText );
      } else {
        var topStrength = this.regionMap.getTopCoilFieldStrengthRegion();
        var bottomStrength = this.regionMap.getBottomCoilFieldStrengthRegion();

        if ( topStrength !== bottomStrength ) {
          strArray.push( this.strengthThroughFourCoilText, this.strengthThroughTwoCoilText );
        } else {
          strArray.push( this.strengthThroughBothCoilsText );
        }
      }

      return showLines ? strArray.join( ' ' ) : hideFieldLinesString;
    },

    get strengthThroughFourCoilText() {
      let strength = FIELD_STRENGTHS[ this.regionMap.getBottomCoilFieldStrengthRegion() ];
      return StringUtils.fillIn( fieldStrengthPassingCoilPatternString, { strength: strength, coil: theFourLoopCoilString } );
    },

    get strengthThroughTwoCoilText() {
      let strength = FIELD_STRENGTHS[ this.regionMap.getTopCoilFieldStrengthRegion() ];
      return StringUtils.fillIn( fieldStrengthPassingCoilPatternString, { strength: strength, coil: theTwoLoopCoilString } );
    },

    get strengthThroughBothCoilsText() {
      let strength = FIELD_STRENGTHS[ this.regionMap.getTopCoilFieldStrengthRegion() ];
      return StringUtils.fillIn( fieldStrengthPassingBothCoilsPatternString, { strength: strength } );
    },

    get magnetLocationAlertText() {
      return StringUtils.fillIn( magnetLocationAlertPatternString, { position: this.positionString } );
    },

    get magnetFocusAlertText() {
      var position = this.positionString;
      var pattern = this._magnetNodeBlurred ? magnetLocationAlertPatternString : magnetLocationExtraAlertPatternString;
      return StringUtils.fillIn( pattern, { position: position } );
    },

    get fieldLinesDescription() {
      var northSide = this._magnet.orientationProperty.get() === OrientationEnum.NS ? leftString : rightString;
      var southSide = this._magnet.orientationProperty.get() === OrientationEnum.SN ? leftString : rightString;
      return StringUtils.fillIn( fieldLinesDescriptionPatternString, { northSide: northSide, southSide: southSide } );
    },

    get fourLoopOnlyFieldStrength() {
      var valueString = FIELD_STRENGTHS[ this.regionMap.getFieldStrengthAtCoilRegion( this._bottomCoil ) ];
      return StringUtils.fillIn( fourLoopOnlyFieldStrengthPatternString, { fieldStrength: valueString } );
    },

    get fourLoopFieldStrength() {
      return this.getFieldStrengthAtCoil( this._bottomCoil );
    },

    get twoLoopFieldStrength() {
      return this.getFieldStrengthAtCoil( this._topCoil );
    },

    getFieldStrengthAtCoil: function( coil ) {
      var fieldStrengthString = FIELD_STRENGTHS[ this.regionMap.getFieldStrengthAtCoilRegion( coil ) ];
      var coilString = coil === this._topCoil ? theTwoLoopCoilString : theFourLoopCoilString;
      return StringUtils.fillIn(
        fieldStrengthPatternString,
        {
          fieldStrength: fieldStrengthString,
          coil: coilString
        } );
    },

    // getFieldStrengthDescription: function( fieldStrength ) {
    //   var i = Util.toFixedNumber( this.mapFieldStrengthToInteger( Math.abs( fieldStrength ) ), 0 );
    //   // console.log('description', fieldStrength);
    //   // console.log(i);
    //   return FIELD_STRENGTHS[ i ];
    // },

    mapFieldStrengthToInteger: function( fieldStrength ) {
      if ( this._bottomCoil.position.distance( this._magnetPosition ) < 70 ) {
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
    },

    get northPoleSideString() {
      return this.getPoleSideString( northString, OrientationEnum.NS );
    },

    get southPoleSideString() {
      return this.getPoleSideString( southString, OrientationEnum.SN );
    },

    getPoleSideString: function( poleString, orientation ) {
      var side = this._magnet.orientationProperty.get() === orientation ? leftString : rightString;
      return StringUtils.fillIn( poleOnThePatternString, { pole: poleString, side: side } );
    },

    get fourLoopOnlyMagnetPosition() {
      return StringUtils.fillIn( barMagnetPositionPatternString, { areaPosition: this.positionOfPlayAreaString } );
    },

    get positionOfPlayAreaString() {
      return StringUtils.fillIn( positionOfPlayAreaPatternString, { position: this.positionString } );
    },

    // handles getting the current position description (e.g. top-left edge, bottom-center, center, etc...)
    get positionString() {
      var description = REGION_DESCRIPTIONS[ this.regionMap.currentRegion ];
      if ( this.regionMap.magnetAtEdge ) {
        description = StringUtils.fillIn( twoWordsPatternString, { first: description, second: edgeString } );
      }

      return description;
    },

    get theFourCoilProximityString() {
      var proximity = PROXIMITY_STRINGS[ this.regionMap.magnetToBottomCoilProximity ];
      return StringUtils.fillIn( twoWordsPatternString, { first: proximity, second: theFourLoopCoilString } );
    },

    get theTwoCoilProximityString() {
      var proximity = PROXIMITY_STRINGS[ this.regionMap.magnetToTopCoilProximity ];
      return StringUtils.fillIn( twoWordsPatternString, { first: proximity, second: theTwoLoopCoilString } );
    },

    get slidingStoppedText() {
      return StringUtils.fillIn( slidingStoppedPatternString, { position: this.positionString } );
    }
  } );
} );