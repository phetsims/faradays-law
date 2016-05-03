// Copyright 2014-2015, University of Colorado Boulder

/**
 * Voltmeter scale for 'Faradays Law' simulation model
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
  var Dimension2 = require( 'DOT/Dimension2' );
  var Util = require( 'DOT/Util' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  /**
   *
   * @param needleAngleProperty - angle of needle in voltmeter
   * @param {Object} [options]
   * @constructor
   */
  function VoltmeterScale( needleAngleProperty, options ) {
    Node.call( this );

    options = _.extend( {
      arcRadius: 55, // radius of voltmeter scale
      needleColor: '#3954a5',
      needleHeight: 53,
      needleWidth: 2,
      needleTipHeight: 12,
      needleTipWidth: 8
    }, options );

    // scale
    var scale = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, -options.arcRadius )
      .moveTo( -options.arcRadius, 0 )
      .arc( 0, 0, options.arcRadius, -Math.PI, 0, false )
      .lineTo( -options.arcRadius, 0 )
      .close(), {
      stroke: 'black',
      lineWidth: 1
    } );
    this.addChild( scale );

    // plus and minus signs
    this.addChild( new PlusNode( {
      centerX: options.arcRadius / 2.3,
      centerY: -options.arcRadius / 2.5,
      size: new Dimension2( 12, 2 )
    } ) );
    this.addChild( new MinusNode( {
      centerX: -options.arcRadius / 2.3,
      centerY: -options.arcRadius / 2.5,
      size: new Dimension2( 12, 2 )
    } ) );

    // needle base
    this.addChild( new Circle( 4, {
      fill: options.needleColor
    } ) );

    // needle
    var needle = new ArrowNode( 0, 0, 0, -options.needleHeight, {
      headHeight: options.needleTipHeight,
      headWidth: options.needleTipWidth,
      tailWidth: options.needleWidth,
      fill: options.needleColor,
      lineWidth: 0
    } );
    this.addChild( needle );

    // observers
    needleAngleProperty.link( function( angle ) {
      needle.rotation = Util.clamp( angle, -Math.PI / 2, Math.PI / 2 );
    } );

    this.mutate( options );
  }

  faradaysLaw.register( 'VoltmeterScale', VoltmeterScale );
  
  return inherit( Node, VoltmeterScale );
} );
