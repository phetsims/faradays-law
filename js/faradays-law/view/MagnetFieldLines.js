// Copyright 2014-2017, University of Colorado Boulder

/**
 * Magnet field lines for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

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
   * @param {Magnet} magnet - magnet model
   * @constructor
   */
  function MagnetFieldLines( magnet ) {
    Node.call( this, {
      children: [
        createSideFieldLines( magnet.flippedProperty, +1 ), // top
        createSideFieldLines( magnet.flippedProperty, -1 ) // bottom
      ]
    } );

    magnet.showFieldLinesProperty.linkAttribute( this, 'visible' );
  }

  /**
   * Create single arrow
   * @param {Object} [options]
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
   * @param {Object} [options]
   * @returns {Node}
   */
  var createArcWithArrow = function( a, b, arrowPositions, flippedProperty, options ) {
    var arcWithArrow = new Node();
    options = _.extend( {
      stroke: '#ffffff',
      lineWidth: 3
    }, options );

    // arc
    var ellipticalShape = new Shape().ellipticalArc( 0, 0, a, b, 0, 0, 2 * Math.PI );
    arcWithArrow.addChild( new Path( ellipticalShape, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } ) );

    // arrows on arc
    arrowPositions.forEach( function( angle ) {
      var arrow = createArrow( {
        stroke: options.stroke,
        lineWidth: options.lineWidth
      } );
      var arrowPosition = ellipticalShape.getLastSegment().positionAtAngle( angle );
      arrow.right = arrowPosition.x;
      arrow.centerY = arrowPosition.y;

      var arrowTangent = ellipticalShape.getLastSegment().tangentAtAngle( angle );
      var rotationAngle = Math.atan( arrowTangent.y / arrowTangent.x ); // angle of tangent to an ellipse

      if ( arrowPosition.y > 0 ) {
        rotationAngle += Math.PI;
      }

      arrow.rotateAround( arrowPosition, rotationAngle );

      flippedProperty.lazyLink( function() {
        arrow.rotateAround( arrowPosition, Math.PI );
      } );
      arcWithArrow.addChild( arrow );
    } );

    return arcWithArrow;
  };

  /**
   * Create half of all magnet field lines
   * @param {BooleanProperty} flippedProperty - is magnet flipped
   * @param {number} scaleY - +1/-1 bottom node is vertically flipped
   * @returns {Node}
   */
  var createSideFieldLines = function( flippedProperty, scaleY ) {
    var sideFieldLinesContainer = new Node();

    var dy = 3;

    // each ellipse change a bit position to show a near constant field
    LINE_DESCRIPTION.forEach( function( line, index ) {
      var arc = createArcWithArrow( line.a, line.b, line.arrowPositions, flippedProperty );
      arc.bottom = 2 - index * dy;
      arc.centerX = 0;
      sideFieldLinesContainer.addChild( arc );
    } );
    sideFieldLinesContainer.scale( 1, scaleY );
    return sideFieldLinesContainer;
  };

  faradaysLaw.register( 'MagnetFieldLines', MagnetFieldLines );

  return inherit( Node, MagnetFieldLines );
} );