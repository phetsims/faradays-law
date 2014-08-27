// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var MagnetNode = require( 'FARADAYS_LAW/view/MagnetNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );

  //curved arrow shape
  var createCurvedArrow = function( options ) {
    var node = new Node();

    var radius = 20;
    var lineWidth = 2;
    var arcStartAngle = -Math.PI * 0.92;
    var arcEndAngle = -Math.PI * 0.15;

    //arc
    var shape = new Shape();
    shape.moveTo( (radius + lineWidth / 2) * Math.cos( arcStartAngle ), (radius + lineWidth / 2) * Math.sin( arcStartAngle ) ); // Inner edge of end.
    shape.arc( 0, 0, radius, arcStartAngle, arcEndAngle, false ); // Outer curve.
    node.addChild( new Path( shape, {
      stroke: '#000',
      lineWidth: lineWidth
    } ) );

    //arrow
    var arrow = new ArrowNode( 0, 0, 0, 5, {
      headWidth: 5,
      rotation: arcEndAngle,
      x: (radius) * Math.cos( arcEndAngle ),
      y: (radius + lineWidth / 2) * Math.sin( arcEndAngle )
    } );
    node.addChild( arrow );
    node.mutate( options );
    return node;
  };

  function FlipMagnetButton( options ) {
    var children = [
      createCurvedArrow(),
      new MagnetNode( false /*flipped*/, {
        width: 74,
        height: 16,
        font: new PhetFont( 14 )
      } ),
      createCurvedArrow( {rotation: Math.PI} )
    ];

    var contentNode = new VBox( {
      children: children,
      spacing: 1
    } );

    RectangularPushButton.call( this, _.extend( {
      content: contentNode,
      baseColor: '#a3cada',
      minWidth: 118,
      minHeight: 65
    }, options ) );

  }

  return inherit( RectangularPushButton, FlipMagnetButton );
} );