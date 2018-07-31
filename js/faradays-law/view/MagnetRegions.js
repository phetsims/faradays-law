// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  // var Vector2 = require( 'DOT/Vector2' );
  // var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var LinearFunction = require( 'DOT/LinearFunction' );
  // var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  // var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  // var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUMBER_OF_ROWS = 3;
  var EDGE_TOLERANCE = 5;
  var VERTICAL_EDGE_TOLERANCE = Util.roundSymmetric( FaradaysLawConstants.MAGNET_HEIGHT / 2 ) + EDGE_TOLERANCE;
  var HORIZONTAL_EDGE_TOLERANCE = Util.roundSymmetric( FaradaysLawConstants.MAGNET_WIDTH / 2 ) + EDGE_TOLERANCE;

  var rowHeight = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getHeight() / NUMBER_OF_ROWS );
  var columnWidth = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getWidth() / NUMBER_OF_ROWS );


  function MagnetRegions( model ) {

    this.magnet = model.magnet;
    this.topCoil = model.topCoil;
    this.bottomCoil = model.bottomCoil;
    this.bounds = model.bounds;

    this.regionChangedEmitter = new Emitter();

    this.magnet.positionProperty.link( ( newPosition, oldPosition ) => {
      if ( oldPosition ) {
        let newRegion = this.getRegion( newPosition );
        let oldRegion = this.getRegion( oldPosition );
        if ( newRegion !== oldRegion ) {
          this.regionChangedEmitter.emit2( newRegion, oldRegion );
        }
      }
    } );
  }

  faradaysLaw.register( 'MagnetRegions', MagnetRegions );

  return inherit( Object, MagnetRegions, {

    get currentRegion() {
      return this.getRegion( this.magnet.positionProperty.get() );
    },

    getRegion: function( vector ) {
      // debugger;
      return ( NUMBER_OF_ROWS * this.getRow( vector.y ) ) + this.getColumn( vector.x );
    },
    // instance methods
    getRow: function( y ) {
      return this.mapSegment( y, rowHeight );
    },

    getColumn: function( x ) {
      return this.mapSegment( x, columnWidth );
    },

    mapSegment: function( num, interval ) {
      for ( let i = 0; i < NUMBER_OF_ROWS; i++ ) {
        if ( num <= ( i + 1 ) * interval ) {
          return i;
        }
      }
      return NUMBER_OF_ROWS - 1;
    },

    isVectorAtEdge: function( { x, y } ) {
      const { minX, minY, maxX, maxY } = this.bounds;
      const verticalMinDistance = Math.min( Math.abs( y - minY ), Math.abs( y - maxY ) );
      const horizontalMinDistance = Math.min( Math.abs( x - minX ), Math.abs( x - maxX ) );

      return verticalMinDistance <= VERTICAL_EDGE_TOLERANCE || horizontalMinDistance <= HORIZONTAL_EDGE_TOLERANCE;
    },

    get magnetAtEdge() {
      return this.isVectorAtEdge( this.magnet.positionProperty.get() );
    }
  } );
} );