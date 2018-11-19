// Copyright 2014-2018, University of Colorado Boulder

/**
 * Wires for both coils.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var ARC_RADIUS = 7;
  var BULB_POSITION = FaradaysLawConstants.BULB_POSITION;
  var WIRE_COLOR = '#7f3521';
  var WIRE_WIDTH = 3;
  var LEFT_WIRE_BULB_START = new Vector2( BULB_POSITION.x - 15, BULB_POSITION.y ); // start point for left wire from bulb
  var RIGHT_WIRE_BULB_START = new Vector2( BULB_POSITION.x + 10, BULB_POSITION.y ); // start point for right wire from bulb

  /**
   * @param {FaradaysLawScreenView} view
   * @param {BooleanProperty} topCoilVisibleProperty
   * @constructor
   */
  function CoilsWiresNode( view, topCoilVisibleProperty ) {
    Node.call( this );

    // bottom coil, left bottom wire
    var arcPoint = new Vector2( LEFT_WIRE_BULB_START.x, view.bottomCoilEndPositions.bottomEnd.y );
    this.addChild( new Path( new Shape()
      .moveToPoint( LEFT_WIRE_BULB_START )
      .lineTo( arcPoint.x, arcPoint.y - ARC_RADIUS )
      .quadraticCurveTo( arcPoint.x, arcPoint.y, arcPoint.x + ARC_RADIUS, arcPoint.y )
      .lineToPoint( view.bottomCoilEndPositions.bottomEnd ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } ) );

    // bottom coil, right top wire
    var arcPoint2 = new Vector2( RIGHT_WIRE_BULB_START.x, view.bottomCoilEndPositions.topEnd.y );
    this.addChild( new Path( new Shape()
      .moveToPoint( RIGHT_WIRE_BULB_START )
      .lineTo( arcPoint2.x, arcPoint2.y - ARC_RADIUS )
      .quadraticCurveTo( arcPoint2.x, arcPoint2.y, arcPoint2.x + ARC_RADIUS, arcPoint2.y )
      .lineToPoint( view.bottomCoilEndPositions.topEnd ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } ) );

    // top coil, top wire
    var lengthRatio = 0.5; // at length ratio wire change direction to top
    var horizontalLength = view.topCoilEndPositions.topEnd.x - RIGHT_WIRE_BULB_START.x; // horizontal length of the top wire
    var yMarginFromBulb = 18; // top margin from bulb y position
    var arcPointA = RIGHT_WIRE_BULB_START.plusXY( horizontalLength * lengthRatio, yMarginFromBulb );
    var arcPointB = new Vector2( RIGHT_WIRE_BULB_START.x + horizontalLength * lengthRatio, view.topCoilEndPositions.topEnd.y );
    var topCoilsWire1 = new Path( new Shape()
      .moveToPoint( RIGHT_WIRE_BULB_START.plusXY( 0, yMarginFromBulb ) )
      .lineTo( arcPointA.x - ARC_RADIUS, arcPointA.y )
      .quadraticCurveTo( arcPointA.x, arcPointA.y, arcPointA.x, arcPointA.y - ARC_RADIUS )
      .lineTo( arcPointB.x, arcPointB.y + ARC_RADIUS )
      .quadraticCurveTo( arcPointB.x, arcPointB.y, arcPointB.x + ARC_RADIUS, arcPointB.y )
      .lineToPoint( view.topCoilEndPositions.topEnd ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } );
    this.addChild( topCoilsWire1 );

    // top coil, bottom wire
    horizontalLength = view.topCoilEndPositions.bottomEnd.x - LEFT_WIRE_BULB_START.x; // horizontal length of the bottom wire
    lengthRatio = 0.55; // at length ratio wire change direction to top
    yMarginFromBulb = 35; // vertical margin from center of the bulb for bottom wire of top coil
    var arcPointX = new Vector2( RIGHT_WIRE_BULB_START.x, LEFT_WIRE_BULB_START.y + yMarginFromBulb ); // top coil, bottom wire, center of crossing with another wire
    var arcPointY = LEFT_WIRE_BULB_START.plusXY( horizontalLength * lengthRatio, yMarginFromBulb ); // top coil, bottom wire, bottom corner point
    var arcPointZ = new Vector2( LEFT_WIRE_BULB_START.x + horizontalLength * lengthRatio, view.topCoilEndPositions.bottomEnd.y ); // top coil, bottom wire, top corner point
    var topCoilsWire2 = new Path( new Shape()
      .moveToPoint( LEFT_WIRE_BULB_START.plusXY( 0, yMarginFromBulb ) )
      .lineTo( arcPointX.x - ARC_RADIUS, arcPointX.y )
      .arc( arcPointX.x, arcPointX.y, ARC_RADIUS, Math.PI, 0, true )
      .lineTo( arcPointY.x - ARC_RADIUS, arcPointY.y )
      .quadraticCurveTo( arcPointY.x, arcPointY.y, arcPointY.x, arcPointY.y - ARC_RADIUS )
      .lineTo( arcPointZ.x, arcPointZ.y + ARC_RADIUS )
      .quadraticCurveTo( arcPointZ.x, arcPointZ.y, arcPointZ.x + ARC_RADIUS, arcPointZ.y )
      .lineToPoint( view.topCoilEndPositions.bottomEnd ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } );
    this.addChild( topCoilsWire2 );

    // top coil wires hidden if top coil is hidden
    topCoilVisibleProperty.linkAttribute( topCoilsWire1, 'visible' );
    topCoilVisibleProperty.linkAttribute( topCoilsWire2, 'visible' );
  }

  faradaysLaw.register( 'CoilsWiresNode', CoilsWiresNode );

  return inherit( Node, CoilsWiresNode );
} );