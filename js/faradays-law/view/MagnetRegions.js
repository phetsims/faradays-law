// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  // var Vector2 = require( 'DOT/Vector2' );
  // var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  // var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  // var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  // var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUMBER_OF_ROWS = 3;
  var { minX, maxX, minY, maxY } = FaradaysLawConstants.LAYOUT_BOUNDS;
  var yToRow = new LinearFunction( minY, maxY, 0, 2, true );
  var xToColumn = new LinearFunction( minX, maxX, 0, 2, true );


  function MagnetRegions( model ) {

    this.magnet = model.magnet;
    this.topCoil = model.topCoil;
    this.bottomCoil = model.bottomCoil;

    this.yToRow = new LinearFunction( 0, model.bounds.maxY, 0, 2, true );
    this.xToColumn = new LinearFunction( 0, model.bounds.maxX, 0, 2, true );
  }

  faradaysLaw.register( 'MagnetRegions', MagnetRegions );

  return inherit( Object, MagnetRegions, {
    // instance methods
    getRow: function( y ) {
      return Util.roundSymmetric( yToRow( y ) );
    },

    getColumn: function( x ) {
      return Util.roundSymmetric( xToColumn( x ) );
    },

    getRegion: function( vector ) {
      return ( NUMBER_OF_ROWS * this.getRow( vector.y ) ) + this.getColumn( vector.x );
    },

    get currentRegion() {
      return this.getRegion( this.magnet.positionProperty.get() );
    }
  } );
} );