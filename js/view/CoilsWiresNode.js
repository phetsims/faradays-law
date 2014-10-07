// Copyright 2002-2014, University of Colorado Boulder

/**
 * Wires for both coils.
 * 'Faradays Law' simulation.
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var ARC_RADIUS = 7;

  /**
   * @param aligner
   * @param showSecondCoilProperty
   * @constructor
   */
  function CoilsWiresNode( aligner, showSecondCoilProperty ) {

    Node.call( this );

    var wireColor = '#7f3521';
    var wireWidth = 3;

    var leftWireBulbStart = new Vector2( aligner.bulbPosition.x - 15, aligner.bulbPosition.y ); //start point for left wire from bulb
    var rightWireBulbStart = new Vector2( aligner.bulbPosition.x + 10, aligner.bulbPosition.y ); //start point for right wire from bulb

    //bottom coil, static wires

    // bottom coil, left bottom wire
    var keyPoints = [
      leftWireBulbStart, // bottom coil, left bottom wire, bulbs start
      new Vector2( leftWireBulbStart.x, aligner.bottomCoilEndPositions.bottomEnd.y ), // bottom coil, left bottom wire, corner point
      aligner.bottomCoilEndPositions.bottomEnd  // bottom coil, left bottom wire, coils end
    ];
    this.addChild( new Path( new Shape()
      .moveTo( keyPoints[0].x, keyPoints[0].y )
      .lineTo( keyPoints[1].x, keyPoints[1].y - ARC_RADIUS )
      .quadraticCurveTo( keyPoints[1].x, keyPoints[1].y, keyPoints[1].x + ARC_RADIUS, keyPoints[1].y )
      .lineTo( keyPoints[2].x, keyPoints[2].y ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    // bottom coil, right top wire
    keyPoints = [
      rightWireBulbStart, // bottom coil, right top, bulbs start
      new Vector2( rightWireBulbStart.x, aligner.bottomCoilEndPositions.topEnd.y ), // bottom coil, right top wire, corner point
      aligner.bottomCoilEndPositions.topEnd  // bottom coil, right top wire, coils end
    ];
    this.addChild( new Path( new Shape()
      .moveTo( keyPoints[0].x, keyPoints[0].y )
      .lineTo( keyPoints[1].x, keyPoints[1].y - ARC_RADIUS )
      .quadraticCurveTo( keyPoints[1].x, keyPoints[1].y, keyPoints[1].x + ARC_RADIUS, keyPoints[1].y )
      .lineTo( keyPoints[2].x, keyPoints[2].y ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    //top coil wires, must be hidden if coil is hidden

    // top coil, top wire
    var lengthRatio = 0.5; // at length ratio wire change direction to top
    var horizontalLength = aligner.topCoilEndPositions.topEnd.x - rightWireBulbStart.x; // horizontal length of the top wire
    var yMarginFromBulb = 18; // top margin from bulb y position
    keyPoints = [
      rightWireBulbStart.plusXY( 0, yMarginFromBulb ), // top coil, top wire, wire start point
      rightWireBulbStart.plusXY( horizontalLength * lengthRatio, yMarginFromBulb ), // top coil, top wire, bottom corner point
      new Vector2( rightWireBulbStart.x + horizontalLength * lengthRatio, aligner.topCoilEndPositions.topEnd.y ), // top coil, top wire, top corner point
      aligner.topCoilEndPositions.topEnd // top coil, top wire end
    ];
    var topCoilsWire1 = new Path( new Shape()
      .moveTo( keyPoints[0].x, keyPoints[0].y )
      .lineTo( keyPoints[1].x - ARC_RADIUS, keyPoints[1].y )
      .quadraticCurveTo( keyPoints[1].x, keyPoints[1].y, keyPoints[1].x, keyPoints[1].y - ARC_RADIUS )
      .lineTo( keyPoints[2].x, keyPoints[2].y + ARC_RADIUS )
      .quadraticCurveTo( keyPoints[2].x, keyPoints[2].y, keyPoints[2].x + ARC_RADIUS, keyPoints[2].y )
      .lineTo( keyPoints[3].x, keyPoints[3].y ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } );
    this.addChild( topCoilsWire1 );

    // top coil, bottom wire
    horizontalLength = aligner.topCoilEndPositions.bottomEnd.x - leftWireBulbStart.x; // horizontal length of the bottom wire
    lengthRatio = 0.55; // at length ratio wire change direction to top
    yMarginFromBulb = 35; // vertical margin from center of the bulb for bottom wire of top coil
    keyPoints = [
      leftWireBulbStart.plusXY( 0, yMarginFromBulb ), // top coil, bottom wire, wire start point
      new Vector2( rightWireBulbStart.x, leftWireBulbStart.y + yMarginFromBulb ), // top coil, bottom wire, center of crossing with another wire
      leftWireBulbStart.plusXY( horizontalLength * lengthRatio, yMarginFromBulb ), // top coil, bottom wire, bottom corner point
      new Vector2( leftWireBulbStart.x + horizontalLength * lengthRatio, aligner.topCoilEndPositions.bottomEnd.y ), // top coil, bottom wire, top corner point
      aligner.topCoilEndPositions.bottomEnd // top coil, bottom wire end
    ];
    var topCoilsWire2 = new Path( new Shape()
      .moveTo( keyPoints[0].x, keyPoints[0].y )
      .lineTo( keyPoints[1].x - ARC_RADIUS, keyPoints[1].y )
      .arc( keyPoints[1].x, keyPoints[1].y, ARC_RADIUS, Math.PI, 0, true )
      .lineTo( keyPoints[2].x - ARC_RADIUS, keyPoints[2].y )
      .quadraticCurveTo( keyPoints[2].x, keyPoints[2].y, keyPoints[2].x, keyPoints[2].y - ARC_RADIUS )
      .lineTo( keyPoints[3].x, keyPoints[3].y + ARC_RADIUS )
      .quadraticCurveTo( keyPoints[3].x, keyPoints[3].y, keyPoints[3].x + ARC_RADIUS, keyPoints[3].y )
      .lineTo( keyPoints[4].x, keyPoints[4].y ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } );
    this.addChild( topCoilsWire2 );

    showSecondCoilProperty.linkAttribute( topCoilsWire1, 'visible' );
    showSecondCoilProperty.linkAttribute( topCoilsWire2, 'visible' );

  }

  return inherit( Node, CoilsWiresNode );
} )
;
