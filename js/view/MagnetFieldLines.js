// Copyright 2002-2014, University of Colorado Boulder

/**
 * Magnet Node, draggable.
 *
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

  // costants
  var ARROW_WIDTH = 16;
  var ARROW_HEIGHT = 18;

  var LINE_DESCRIPTION = [
    {a: 90, b: 25, arrowPositions: [Math.PI / 2]},
    {a: 180, b: 50, arrowPositions: [Math.PI / 2]},
    {a: 350, b: 125, arrowPositions: [Math.PI / 2]},
    {a: 600, b: 300, arrowPositions: [Math.PI / 2]}
  ];

  var createArrow = function( options ) {
    return new Path( new Shape()
      .moveTo( -ARROW_WIDTH / 2, -ARROW_HEIGHT )
      .lineTo( 0, 0 )
      .lineTo( +ARROW_WIDTH / 2, -ARROW_HEIGHT ), {
        stroke: options.stroke,
        lineWidth: options.lineWidth
      }
    );
  };

  var createArcWithArrow = function( a, b, arrowPositions, flippedProperty, options ) {
    var node = new Node();
    options = _.extend( {
      stroke: '#FF9999',
      lineWidth: 3
    }, options );

    //ellipticalArc( centerX, centerY, radiusX, radiusy, rotation, startAngle, endAngle, anticlockwise )
    //arc
    node.addChild( new Path( new Shape()
      .ellipticalArc( 0, 0, a, b, 0, 0, 2 * Math.PI ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } ) );

    arrowPositions.forEach( function( angle ) {


      // calculate arrow position in terms of x,y
      var r = a * b / (Math.sqrt( b * b * Math.cos( angle ) * Math.cos( angle ) + a * a * Math.sin( angle ) * Math.sin( angle ) ));
      var x = r * Math.cos( angle );
      var y = -r * Math.sin( angle );
      var arrow = createArrow( {
        stroke: options.stroke,
        lineWidth: options.lineWidth
      } );
      arrow.bottom = y;
      arrow.centerX = x;
      arrow.rotateAround( new Vector2( x, y ), Math.PI - angle );

      flippedProperty.link( function( flipped ) {
        arrow.rotateAround( new Vector2( x, y ), Math.PI );
      } );
      node.addChild( arrow );
    } );

    return node;
  };

  var createSideFieldLines = function( flippedProperty ) {
    var node = new Node();

    LINE_DESCRIPTION.forEach( function( line ) {
      var arc = createArcWithArrow( line.a, line.b, line.arrowPositions, flippedProperty );
      arc.bottom = 0;
      arc.centerX = 0;
      node.addChild( arc );
    } );
    return node;
  };

  function MagnetFieldLines( flippedProperty ) {
    var self = this;
    Node.call( this );

    // top field lines
    var topLines = createSideFieldLines( flippedProperty );
    this.addChild( topLines );

    // bottom field lines
    var bottomLines = createSideFieldLines( flippedProperty );
    bottomLines.rotation = Math.PI;
    this.addChild( bottomLines );
  }

  return inherit( Node, MagnetFieldLines );
} )
;
