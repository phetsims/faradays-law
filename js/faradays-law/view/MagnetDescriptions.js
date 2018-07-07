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
  var topLeftString = FaradaysLawA11yStrings.topLeftString.value;
  var topCenterString = FaradaysLawA11yStrings.topCenterString.value;
  var topRightString = FaradaysLawA11yStrings.topRightString.value;
  var middleLeftString = FaradaysLawA11yStrings.middleLeftString.value;
  var centerString = FaradaysLawA11yStrings.centerString.value;
  var middleRightString = FaradaysLawA11yStrings.middleRightString.value;
  var bottomLeftString = FaradaysLawA11yStrings.bottomLeftString.value;
  var bottomCenterString = FaradaysLawA11yStrings.bottomCenterString.value;
  var bottomRightString = FaradaysLawA11yStrings.bottomRightString.value;
  var edgeString = FaradaysLawA11yStrings.edgeString.value;
  var twoWordsPatternString = FaradaysLawA11yStrings.twoWordsPatternString.value;
  // var magnetPositionPatternString = FaradaysLawA11yStrings.magnetPositionPatternString.value;
  var inString = FaradaysLawA11yStrings.inString.value;

  // constants
  var REGION_DESCRIPTIONS = [
    [ topLeftString,    topCenterString,    topRightString ],
    [ middleLeftString, centerString,       middleRightString ],
    [ bottomLeftString, bottomCenterString, bottomRightString ]
  ];

  var EDGE_TOLERANCE = 5;

  // can create a linear function to map distances to integers 0 - 2
  // var PROXIMITY_STRINGS = [ 'Very close to', 'Close to', 'Far from' ];

  var proxMap = new LinearFunction( 0, 260, 0, 2, true );

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
    );

    this._bottomCoilInnerBounds = new Bounds2(
      Math.min( model.listOfRestrictedBounds[ 2 ].minX, model.listOfRestrictedBounds[ 3 ].minX ),
      Math.min( model.listOfRestrictedBounds[ 2 ].minY, model.listOfRestrictedBounds[ 3 ].minY ),
      Math.max( model.listOfRestrictedBounds[ 2 ].maxX, model.listOfRestrictedBounds[ 3 ].maxX ),
      Math.max( model.listOfRestrictedBounds[ 2 ].maxY, model.listOfRestrictedBounds[ 3 ].maxY )
    );

    this._magnet.positionProperty.link( function( position ) {
      self._magnetPosition = position;
        self.bottomCoilProximityString;
    } );
  }

  faradaysLaw.register( 'MagnetDescriptions', MagnetDescriptions );

  return inherit( Object, MagnetDescriptions, {

    getRow: function ( y ) {
      for ( var i = 0; i < this.rows.length; i++ ) {
        if ( this.rows[ i ].contains( y ) ) {
          return i;
        }
      }
    },

    getColumn: function ( x ) {
      for ( var i = 0; i < this.columns.length; i++ ) {
        if ( this.columns[ i ].contains( x ) ) {
          return i;
        }
      }
    },

    // handles getting the current position description (e.g. top-left edge, bottom-center, center, etc...)
    get positionString() {
      var description = REGION_DESCRIPTIONS[ this.getRow( this._magnetPosition.x ) ][ this.getColumn( this._magnetPosition.y ) ];

      if ( this.magnetIsAtEdge() ) {
        description = StringUtils.fillIn( twoWordsPatternString, { first: description, second: edgeString } );
      }

      return description;
    },

    get topCoilProximityString() {
      var magnetBounds = this.createMagnetBounds();

      if ( this._topCoilInnerBounds.intersectsBounds( magnetBounds ) ) {
        return inString;
      }

      // var distance = this._topCoilPosition.distance( this._magnetPosition );
    },

    get bottomCoilProximityString() {
      // debugger;
      var magnetBounds = this.createMagnetBounds();

      if ( this._bottomCoilInnerBounds.intersectsBounds( magnetBounds ) ) {
        return inString;
      }

      var distance = this._magnetPosition.distance( this._bottomCoilPosition );
      var i = Util.toFixedNumber( proxMap( distance ), 0 );
    },

    createMagnetBounds: function () {
      return new Bounds2(
        this._magnetPosition.x - this._halfMagnetWidth,
        this._magnetPosition.y - this._halfMagnetHeight,
        this._magnetPosition.x + this._halfMagnetWidth,
        this._magnetPosition.y + this._halfMagnetHeight
      );
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