// Copyright 2014-2017, University of Colorado Boulder

/**
 * Bulb node for 'Faradays Law' simulation
 *
 * @author Vasily Shakhov (MLearner)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var bulbBaseImage = require( 'mipmap!SCENERY_PHET/light-bulb-base.png' );

  // constants
  var BULB_HEIGHT = 125;
  var BULB_WIDTH = 65;
  var BULB_BASE_WIDTH = 36;
  var NUM_FILAMENT_ZIG_ZAGS = 8;
  var FILAMENT_ZIG_ZAG_SPAN = 8;
  var BULB_X_DISPLACEMENT = -45; // Bulb dx relative to center position
  var BULB_NECK_WIDTH = BULB_BASE_WIDTH * 0.85;
  var CONTROL_POINT_Y_VALUE = BULB_WIDTH * 0.7;

  /**
   * @param {NumberProperty} needleAngleProperty - value of voltage meter
   * @param {Object} [options]
   * @constructor
   */
  function BulbNode( needleAngleProperty, options ) {
    Node.call( this );

    // Create the base of the bulb
    var bulbBase = new Image( bulbBaseImage );
    bulbBase.scale( BULB_BASE_WIDTH / bulbBase.height );

    // Important Note: For the drawing code below, the reference frame is assumed to be such that the point x=0, y=0 is
    // at the left side of the light bulb base, which is also the right side of the light bulb body, and the vertical
    // center of both.  This was the easiest to work with.

    // Create the bulb body.
    var bulbBodyHeight = BULB_HEIGHT - bulbBase.width; // TODO: why is the bulb body a function of its width?
    var bulbShape = new Shape().moveTo( 0, -BULB_NECK_WIDTH / 2 ).cubicCurveTo( -bulbBodyHeight * 0.33, -CONTROL_POINT_Y_VALUE, -bulbBodyHeight * 0.95, -CONTROL_POINT_Y_VALUE, -bulbBodyHeight, 0 ).cubicCurveTo( -bulbBodyHeight * 0.95, CONTROL_POINT_Y_VALUE, -bulbBodyHeight * 0.33, CONTROL_POINT_Y_VALUE, 0, BULB_NECK_WIDTH / 2 );
    var bulbBodyOutline = new Path( bulbShape, {
      stroke: 'black',
      lineCap: 'round'
    } );
    var bulbBodyFill = new Path( bulbShape, {
      fill: new RadialGradient(
        bulbBodyOutline.centerX, bulbBodyOutline.centerY,
        BULB_WIDTH / 10, bulbBodyOutline.centerX,
        bulbBodyOutline.centerY, BULB_WIDTH / 2
      )
        .addColorStop( 0, '#eeeeee' )
        .addColorStop( 1, '#bbccbb' )
    } );

    // Create the filament support wires.
    var filamentWireHeight = bulbBodyHeight * 0.6;
    var filamentTopPoint = new Vector2( -filamentWireHeight, -BULB_WIDTH * 0.3 );
    var filamentBottomPoint = new Vector2( -filamentWireHeight, BULB_WIDTH * 0.3 );
    var filamentSupportWiresShape = new Shape()
      .moveTo( 0, -BULB_BASE_WIDTH * 0.3 )
      .cubicCurveTo( -filamentWireHeight * 0.3, -BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentTopPoint.y, filamentTopPoint.x, filamentTopPoint.y )
      .moveTo( 0, BULB_BASE_WIDTH * 0.3 )
      .cubicCurveTo( -filamentWireHeight * 0.3, BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentBottomPoint.y, filamentBottomPoint.x, filamentBottomPoint.y );
    var filamentSupportWires = new Path( filamentSupportWiresShape, { stroke: 'black' } );

    // Create the filament, which is a zig-zag shape.
    var filamentShape = new Shape().moveToPoint( filamentTopPoint );
    for ( var i = 0; i < NUM_FILAMENT_ZIG_ZAGS - 1; i++ ) {
      var yPos = filamentTopPoint.y + ( filamentBottomPoint.y - filamentTopPoint.y ) / NUM_FILAMENT_ZIG_ZAGS * (i + 1);
      var xZig = i % 2 === 0 ? FILAMENT_ZIG_ZAG_SPAN : 0;
      filamentShape.lineTo( filamentTopPoint.x + xZig, yPos );
    }
    filamentShape.lineToPoint( filamentBottomPoint );
    var filament = new Path( filamentShape, { stroke: 'black' } );

    // Create the 'halo' that makes the bulb look like it is shining.
    var haloNode = new Node( {
      children: [ new Circle( 5, {
        fill: 'white',
        opacity: 0.46
      } ), new Circle( 3.75, {
        fill: 'white',
        opacity: 0.51
      } ), new Circle( 2, {
        fill: 'white'
      } ) ]
    } );

    // Update the halo as the needle angle changes.
    // TODO: the bulb brightness shouldn't depend on the needle angle
    needleAngleProperty.link( function( needleAngle ) {

      // in angle = 1, we would have 200x200 halo (max circle diameter - 10px, so 200/10 = 20)
      var scale = 20 * Math.abs( needleAngle );
      if ( scale < 0.1 ) {
        haloNode.visible = false;
      }
      else {
        haloNode.visible = true;
        haloNode.scale( scale / haloNode.transform.matrix.scaleVector.x );
      }
    } );

    // Layering
    this.children = [
      bulbBodyFill,
      filamentSupportWires,
      filament,
      haloNode,
      bulbBase,
      bulbBodyOutline
    ];

    // Do some last layout
    bulbBase.centerY = 0;
    bulbBase.left = 0;
    haloNode.center = filament.center;

    this.mutate( options );

    this.translate( BULB_X_DISPLACEMENT, 0 );
  }

  faradaysLaw.register( 'BulbNode', BulbNode );

  return inherit( Node, BulbNode );
} );