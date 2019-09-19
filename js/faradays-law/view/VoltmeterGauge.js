// Copyright 2014-2017, University of Colorado Boulder

/**
 * Voltmeter gauge (panel with needle) for 'Faradays Law'
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MinusNode = require( 'SCENERY_PHET/MinusNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PlusNode = require( 'SCENERY_PHET/PlusNode' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

  /**
   * @param {NumberProperty} needleAngleProperty - angle of needle in voltmeter
   * @param {Object} [options]
   * @constructor
   */
  function VoltmeterGauge( needleAngleProperty, options ) {
    Node.call( this );
    var arcRadius = 55; // radius of voltmeter scale
    var needleColor = '#3954a5'; // blue

    // background panel within which the needle moves
    var background = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, -arcRadius )
      .moveTo( -arcRadius, 0 )
      .arc( 0, 0, arcRadius, -Math.PI, 0, false )
      .lineTo( -arcRadius, 0 )
      .close(), {
      stroke: 'black',
      lineWidth: 1
    } );
    this.addChild( background );

    // plus and minus signs
    this.addChild( new PlusNode( {
      centerX: arcRadius / 2.3,
      centerY: -arcRadius / 2.5,
      size: new Dimension2( 12, 2 )
    } ) );
    this.addChild( new MinusNode( {
      centerX: -arcRadius / 2.3,
      centerY: -arcRadius / 2.5,
      size: new Dimension2( 12, 2 )
    } ) );

    // needle base
    this.addChild( new Circle( 4, {
      fill: needleColor
    } ) );

    // needle
    var needleArrowNode = new ArrowNode( 0, 0, 0, -53, {
      headHeight: 12,
      headWidth: 8,
      tailWidth: 2,
      fill: needleColor,
      lineWidth: 0
    } );
    this.addChild( needleArrowNode );

    // observers
    needleAngleProperty.link( function( needleAngle ) {
      needleArrowNode.rotation = Util.clamp( needleAngle, -Math.PI / 2, Math.PI / 2 );
    } );

    this.mutate( options );
  }

  faradaysLaw.register( 'VoltmeterGauge', VoltmeterGauge );

  return inherit( Node, VoltmeterGauge );
} );