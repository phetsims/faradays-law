// Copyright 2014-2018, University of Colorado Boulder

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
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  // var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  // var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
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

  var barMagnetPositionPatternString = FaradaysLawA11yStrings.barMagnetPositionPattern.value;
  var positionOfPlayAreaPatternString = FaradaysLawA11yStrings.positionOfPlayAreaPattern.value;
  var inString = FaradaysLawA11yStrings.in.value;
  var veryCloseToString = FaradaysLawA11yStrings.veryCloseTo.value;
  var closeToString = FaradaysLawA11yStrings.closeTo.value;
  var farFromString = FaradaysLawA11yStrings.farFrom.value;
  // var northString = FaradaysLawA11yStrings.north.value;
  // var southString = FaradaysLawA11yStrings;

  var theFourLoopCoilString = FaradaysLawA11yStrings.theFourLoopCoil.value;
  var theTwoLoopCoilString = FaradaysLawA11yStrings.theTwoLoopCoil.value;

  // constants
  var REGION_DESCRIPTIONS = [
    [ topLeftString,    topCenterString,    topRightString ],
    [ middleLeftString, centerString,       middleRightString ],
    [ bottomLeftString, bottomCenterString, bottomRightString ]
  ];

  var EDGE_TOLERANCE = 5;

  // can create a linear function to map distances to integers 0 - 2
  var PROXIMITY_STRINGS = [ veryCloseToString, closeToString, farFromString ];
  var proximityMapFunction = new LinearFunction( 95, 260, 0, 2, true ); // determined empirically from sim testing

  function MagnetDescriptions( model ) {
    var self = this;
    // likely private
    this._bounds = model.bounds;
    this._magnet = model.magnet;
    this._magnetPosition = new Vector2( 0, 0 );
    this._topCoilPosition = model.topCoil.position;
    this._bottomCoilPosition = model.bottomCoil.position;


    this._halfMagnetHeight = Util.roundSymmetric( this._magnet.height / 2 );
    this._halfMagnetWidth = Util.roundSymmetric( this._magnet.width / 2 );

    // create 9 regions for magnet position and ensure they DO NOT overlap
    var regionWidth = Util.roundSymmetric( this._bounds.width / 3 );
    var regionHeight = Util.roundSymmetric( this._bounds.height / 3 );

    this.rows = [
      new Range( this._bounds.minY, regionHeight - 1 ),
      new Range( regionHeight, ( 2 * regionHeight ) - 1 ),
      new Range( 2 * regionHeight, this._bounds.maxY )
    ];

    this.columns = [
      new Range( this._bounds.minX, regionWidth - 1 ),
      new Range( regionWidth, ( 2 * regionWidth ) - 1 ),
      new Range( 2 * regionWidth, this._bounds.maxX )
    ];

    // generate bounds to indicate if magnet is inside the coil
    this._topCoilInnerBounds = new Bounds2(
      Math.min( model.listOfRestrictedBounds[ 0 ].minX, model.listOfRestrictedBounds[ 1 ].minX ),
      Math.min( model.listOfRestrictedBounds[ 0 ].minY, model.listOfRestrictedBounds[ 1 ].minY ),
      Math.max( model.listOfRestrictedBounds[ 0 ].maxX, model.listOfRestrictedBounds[ 1 ].maxX ),
      Math.max( model.listOfRestrictedBounds[ 0 ].maxY, model.listOfRestrictedBounds[ 1 ].maxY )
    ).eroded( 5 );

    this._bottomCoilInnerBounds = new Bounds2(
      Math.min( model.listOfRestrictedBounds[ 2 ].minX, model.listOfRestrictedBounds[ 3 ].minX ),
      Math.min( model.listOfRestrictedBounds[ 2 ].minY, model.listOfRestrictedBounds[ 3 ].minY ),
      Math.max( model.listOfRestrictedBounds[ 2 ].maxX, model.listOfRestrictedBounds[ 3 ].maxX ),
      Math.max( model.listOfRestrictedBounds[ 2 ].maxY, model.listOfRestrictedBounds[ 3 ].maxY )
    ).eroded( 5 );

    this._magnet.positionProperty.link( function( position ) {
      self._magnetPosition = position;
    } );
  }

  faradaysLaw.register( 'MagnetDescriptions', MagnetDescriptions );

  return inherit( Object, MagnetDescriptions, {

    get fourLoopOnlyMagnetPosition() {
      return StringUtils.fillIn( barMagnetPositionPatternString, { areaPosition: this.positionOfPlayAreaString } );
    },

    get positionOfPlayAreaString() {
      // {{position}} of the Play Area
      return StringUtils.fillIn( positionOfPlayAreaPatternString, { position: this.positionString } );
    },

    getRow: function ( y ) {
      for ( var i = 0; i < this.rows.length; i++ ) {
        if ( this.rows[ i ].contains( Math.round( y ) ) ) {
          return i;
        }
      }
    },

    getColumn: function ( x ) {
      for ( var i = 0; i < this.columns.length; i++ ) {
        if ( this.columns[ i ].contains( Math.round( x ) ) ) {
          return i;
        }
      }
    },

    // handles getting the current position description (e.g. top-left edge, bottom-center, center, etc...)
    get positionString() {
      var description = REGION_DESCRIPTIONS[ this.getRow( this._magnetPosition.y ) ][ this.getColumn( this._magnetPosition.x ) ];

      if ( this.magnetIsAtEdge() ) {
        description = StringUtils.fillIn( twoWordsPatternString, { first: description, second: edgeString } );
      }

      return description;
    },

    get theFourCoilProximityString() {
      var proximity = this.getCoilProximityString( this._topCoilInnerBounds );
      return StringUtils.fillIn( twoWordsPatternString, { first: proximity, second: theFourLoopCoilString } );
    },

    get theTwoCoilProximityString() {
      var proximity = this.getCoilProximityString( this._bottomCoilInnerBounds );
      return StringUtils.fillIn( twoWordsPatternString, { first: proximity, second: theTwoLoopCoilString } );
    },

    getCoilProximityString: function( coilBounds ) {
      var magnetBounds = this.createMagnetBounds();

      if ( coilBounds.intersectsBounds( magnetBounds ) ) {
        return inString;
      }

      var distance = coilBounds === this._topCoilInnerBounds ? this.distanceToTopCoil : this.distanceToBottomCoil;

      var i = Util.toFixedNumber( proximityMapFunction( distance ), 0 );
      return PROXIMITY_STRINGS[ i ];
    },

    createMagnetBounds: function () {
      return new Bounds2(
        this._magnetPosition.x - this._halfMagnetWidth,
        this._magnetPosition.y - this._halfMagnetHeight,
        this._magnetPosition.x + this._halfMagnetWidth,
        this._magnetPosition.y + this._halfMagnetHeight
      );
    },

    get distanceToTopCoil() {
      return this.getDistanceToCoil( this._topCoilPosition );
    },

    get distanceToBottomCoil() {
      return this.getDistanceToCoil( this._bottomCoilPosition );
    },

    getDistanceToCoil: function( coilPosition ) {
      var magnetPoint = this.createMagnetBounds().closestPointTo( coilPosition );
      return magnetPoint.distance( coilPosition );
    },

    magnetIsAtEdge: function() {
      var diffTop = Math.abs( ( this._magnetPosition - this._halfMagnetHeight ) - this._bounds.minY );
      var diffBottom = Math.abs( ( this._magnetPosition + this._halfMagnetHeight ) - this._bounds.maxY );
      var diffLeft = Math.abs( ( this._magnetPosition - this._halfMagnetWidth ) -  this._bounds.minX );
      var diffRight = Math.abs( ( this._magnetPosition + this._halfMagnetWidth ) - this._bounds.maxX );

      return diffTop    <= EDGE_TOLERANCE ||
             diffBottom <= EDGE_TOLERANCE ||
             diffRight  <= EDGE_TOLERANCE ||
             diffLeft   <= EDGE_TOLERANCE;
    }
  } );
} );