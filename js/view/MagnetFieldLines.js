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

  // constants
  var ARROW_WIDTH = 16;
  var ARROW_HEIGHT = 18;

  // describes ellipse lines properties (sizes + arrows)
  var LINE_DESCRIPTION = [
    { a: 600, b: 300, arrowPositions: [ Math.PI / 3.5, Math.PI - Math.PI / 3.5 ] },
    { a: 350, b: 125, arrowPositions: [ Math.PI / 7, Math.PI - Math.PI / 7 ] },
    { a: 180, b: 50, arrowPositions: [ -Math.PI / 2 ] },
    { a: 90, b: 25, arrowPositions: [ -Math.PI / 2 ] }
  ];

  /**
   * Create single arrow
   * @param options
   * @returns {Path}
   */
  var createArrow = function( options ) {
    return new Path( new Shape()
        .moveTo( -ARROW_WIDTH, -ARROW_HEIGHT / 2 )
        .lineTo( 0, 0 )
        .lineTo( -ARROW_WIDTH, ARROW_HEIGHT / 2 ), {
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
      stroke: '#ffffff',
      lineWidth: 3
    }, options );

    //arc
    var elliplicalShape = new Shape().ellipticalArc( 0, 0, a, b, 0, 0, 2 * Math.PI );
    node.addChild( new Path( elliplicalShape, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } ) );

    //arrows on arc
    arrowPositions.forEach( function( angle ) {
      var arrow = createArrow( {
        stroke: options.stroke,
        lineWidth: options.lineWidth
      } );
      var arrowPosition = elliplicalShape.getLastSegment().positionAtAngle( angle );
      arrow.right = arrowPosition.x;
      arrow.centerY = arrowPosition.y;

      var arrowTangent = elliplicalShape.getLastSegment().tangentAtAngle( angle );
      var rotationAngle = Math.atan( arrowTangent.y / arrowTangent.x ); //angle of tangent to an ellipse

      if ( arrowPosition.y > 0 ) {
        rotationAngle += Math.PI;
      }

      arrow.rotateAround( arrowPosition, rotationAngle );

      flippedProperty.lazyLink( function( flipped ) {
        arrow.rotateAround( arrowPosition, Math.PI );
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

    var dy = 3;
    //each ellipse change a bit position to show a near constant field

    LINE_DESCRIPTION.forEach( function( line, index ) {
      var arc = createArcWithArrow( line.a, line.b, line.arrowPositions, flippedProperty );
      arc.bottom = 2 - index * dy;
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
    bottomLines.scale( 1, -1 );
    this.addChild( bottomLines );

    magnetModel.showFieldLinesProperty.linkAttribute( this, 'visible' );

  }

  return inherit( Node, MagnetFieldLines );
} )
;
