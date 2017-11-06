// Copyright 2014-2017, University of Colorado Boulder

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
  var LEFT_WIRE_BULB_START = new Vector2( BULB_POSITION.x - 15, BULB_POSITION.y ); //start point for left wire from bulb
  var RIGHT_WIRE_BULB_START = new Vector2( BULB_POSITION.x + 10, BULB_POSITION.y ); //start point for right wire from bulb

  /**
   * @param {FaradaysLawScreenView} view
   * @param showTopCoilProperty
   * @constructor
   */
  function CoilsWiresNode( view, showTopCoilProperty ) {

    Node.call( this );

    // bottom coil, static wires

    // bottom coil, left bottom wire
    var arcPoint = new Vector2( LEFT_WIRE_BULB_START.x, view.bottomCoilEndPositions.bottomEnd.y ); // bottom coil, left bottom wire, corner point;
    this.addChild( new Path( new Shape()
      .moveToPoint( LEFT_WIRE_BULB_START )
      .lineTo( arcPoint.x, arcPoint.y - ARC_RADIUS )
      .quadraticCurveTo( arcPoint.x, arcPoint.y, arcPoint.x + ARC_RADIUS, arcPoint.y )
      .lineToPoint( view.bottomCoilEndPositions.bottomEnd ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } ) );

    // bottom coil, right top wire
    var keyPoints = [
      RIGHT_WIRE_BULB_START, // bottom coil, right top, bulbs start
      new Vector2( RIGHT_WIRE_BULB_START.x, view.bottomCoilEndPositions.topEnd.y ), // bottom coil, right top wire, corner point
      view.bottomCoilEndPositions.topEnd  // bottom coil, right top wire, coils end
    ];
    this.addChild( new Path( new Shape()
      .moveTo( keyPoints[ 0 ].x, keyPoints[ 0 ].y )
      .lineTo( keyPoints[ 1 ].x, keyPoints[ 1 ].y - ARC_RADIUS )
      .quadraticCurveTo( keyPoints[ 1 ].x, keyPoints[ 1 ].y, keyPoints[ 1 ].x + ARC_RADIUS, keyPoints[ 1 ].y )
      .lineTo( keyPoints[ 2 ].x, keyPoints[ 2 ].y ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } ) );

    // top coil wires, must be hidden if coil is hidden

    // top coil, top wire
    var lengthRatio = 0.5; // at length ratio wire change direction to top
    var horizontalLength = view.topCoilEndPositions.topEnd.x - RIGHT_WIRE_BULB_START.x; // horizontal length of the top wire
    var yMarginFromBulb = 18; // top margin from bulb y position
    keyPoints = [
      RIGHT_WIRE_BULB_START.plusXY( 0, yMarginFromBulb ), // top coil, top wire, wire start point
      RIGHT_WIRE_BULB_START.plusXY( horizontalLength * lengthRatio, yMarginFromBulb ), // top coil, top wire, bottom corner point
      new Vector2( RIGHT_WIRE_BULB_START.x + horizontalLength * lengthRatio, view.topCoilEndPositions.topEnd.y ), // top coil, top wire, top corner point
      view.topCoilEndPositions.topEnd // top coil, top wire end
    ];
    var topCoilsWire1 = new Path( new Shape()
      .moveTo( keyPoints[ 0 ].x, keyPoints[ 0 ].y )
      .lineTo( keyPoints[ 1 ].x - ARC_RADIUS, keyPoints[ 1 ].y )
      .quadraticCurveTo( keyPoints[ 1 ].x, keyPoints[ 1 ].y, keyPoints[ 1 ].x, keyPoints[ 1 ].y - ARC_RADIUS )
      .lineTo( keyPoints[ 2 ].x, keyPoints[ 2 ].y + ARC_RADIUS )
      .quadraticCurveTo( keyPoints[ 2 ].x, keyPoints[ 2 ].y, keyPoints[ 2 ].x + ARC_RADIUS, keyPoints[ 2 ].y )
      .lineTo( keyPoints[ 3 ].x, keyPoints[ 3 ].y ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } );
    this.addChild( topCoilsWire1 );

    // top coil, bottom wire
    horizontalLength = view.topCoilEndPositions.bottomEnd.x - LEFT_WIRE_BULB_START.x; // horizontal length of the bottom wire
    lengthRatio = 0.55; // at length ratio wire change direction to top
    yMarginFromBulb = 35; // vertical margin from center of the bulb for bottom wire of top coil
    keyPoints = [
      LEFT_WIRE_BULB_START.plusXY( 0, yMarginFromBulb ), // top coil, bottom wire, wire start point
      new Vector2( RIGHT_WIRE_BULB_START.x, LEFT_WIRE_BULB_START.y + yMarginFromBulb ), // top coil, bottom wire, center of crossing with another wire
      LEFT_WIRE_BULB_START.plusXY( horizontalLength * lengthRatio, yMarginFromBulb ), // top coil, bottom wire, bottom corner point
      new Vector2( LEFT_WIRE_BULB_START.x + horizontalLength * lengthRatio, view.topCoilEndPositions.bottomEnd.y ), // top coil, bottom wire, top corner point
      view.topCoilEndPositions.bottomEnd // top coil, bottom wire end
    ];
    var topCoilsWire2 = new Path( new Shape()
      .moveTo( keyPoints[ 0 ].x, keyPoints[ 0 ].y )
      .lineTo( keyPoints[ 1 ].x - ARC_RADIUS, keyPoints[ 1 ].y )
      .arc( keyPoints[ 1 ].x, keyPoints[ 1 ].y, ARC_RADIUS, Math.PI, 0, true )
      .lineTo( keyPoints[ 2 ].x - ARC_RADIUS, keyPoints[ 2 ].y )
      .quadraticCurveTo( keyPoints[ 2 ].x, keyPoints[ 2 ].y, keyPoints[ 2 ].x, keyPoints[ 2 ].y - ARC_RADIUS )
      .lineTo( keyPoints[ 3 ].x, keyPoints[ 3 ].y + ARC_RADIUS )
      .quadraticCurveTo( keyPoints[ 3 ].x, keyPoints[ 3 ].y, keyPoints[ 3 ].x + ARC_RADIUS, keyPoints[ 3 ].y )
      .lineTo( keyPoints[ 4 ].x, keyPoints[ 4 ].y ), {
      stroke: WIRE_COLOR,
      lineWidth: WIRE_WIDTH
    } );
    this.addChild( topCoilsWire2 );

    showTopCoilProperty.linkAttribute( topCoilsWire1, 'visible' );
    showTopCoilProperty.linkAttribute( topCoilsWire2, 'visible' );
  }

  faradaysLaw.register( 'CoilsWiresNode', CoilsWiresNode );

  return inherit( Node, CoilsWiresNode );
} );
