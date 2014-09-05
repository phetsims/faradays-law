// Copyright 2002-2014, University of Colorado Boulder

/**
 * Magnet field lines for 'Faradays Law' simulation.
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

  // constants
  var ARROW_WIDTH = 16;
  var ARROW_HEIGHT = 18;

  // describes ellipse lines properties (sizes + arrows)
  var LINE_DESCRIPTION = [
    {a: 90, b: 25, arrowPositions: [Math.PI / 2]},
    {a: 180, b: 50, arrowPositions: [Math.PI / 2]},
    {a: 350, b: 125, arrowPositions: [Math.PI / 2]},
    {a: 600, b: 300, arrowPositions: [Math.PI / 2]}
  ];

  /**
   * Create single arrow
   * @param options
   * @returns {Path}
   */
  var createArrow = function( options ) {
    return new Path( new Shape()
      .moveTo( -ARROW_WIDTH / 2, ARROW_HEIGHT )
      .lineTo( 0, 0 )
      .lineTo( ARROW_WIDTH / 2, ARROW_HEIGHT ), {
        stroke: options.stroke,
        lineWidth: options.lineWidth
      }
    );
  };

  /**
   * Create ellipse with arrows on it.
   * @param a - major axis of ellipse
   * @param b - minor axis of ellipse
   * @param arrowPositions - array of angle positions of arrows on ellipse
   * @param flippedProperty - is magnet flipped
   * @param options
   * @returns {Node}
   */
  var createArcWithArrow = function( a, b, arrowPositions, flippedProperty, options ) {
    var node = new Node();
    options = _.extend( {
      stroke: '#FF9999',
      lineWidth: 3
    }, options );

    //arc
    node.addChild( new Path( new Shape()
      .ellipticalArc( 0, 0, a, b, 0, 0, 2 * Math.PI ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } ) );

    //arrows on arc
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

  /**
   * create half of all magnet field lines (top by default)
   * @param flippedProperty is magnet flipped
   * @returns {Node}
   */
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

  /**
   * @param magnetModel - magnet model of 'Faradays Law' simulation
   * @constructor
   */
  function MagnetFieldLines( magnetModel ) {
    Node.call( this );

    // top field lines
    var topLines = createSideFieldLines( magnetModel.flippedProperty );
    this.addChild( topLines );

    // bottom field lines
    var bottomLines = createSideFieldLines( magnetModel.flippedProperty );
    bottomLines.scale(1,-1);
    this.addChild( bottomLines );

    magnetModel.showFieldLinesProperty.linkAttribute( this, 'visible' );

  }

  return inherit( Node, MagnetFieldLines );
} )
;
