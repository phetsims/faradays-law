// Copyright 2014-2017, University of Colorado Boulder

/**
 * Voltmeter wires for 'Faradays Law' simulation model
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var BULB_POSITION = FaradaysLawConstants.BULB_POSITION;
  var VOLTMETER_POSITION = FaradaysLawConstants.VOLTMETER_POSITION;

  /**
   * Creates measure pad.
   * @param {Object} [options]
   * @returns {Node}
   */
  var createPad = function( options ) {

    // params
    var baseColor = new Color( '#b4b5b5' );
    var transparentColor = baseColor.withAlpha( 0 );
    var radius = 7;
    var gradientLength = 2;
    var innerGradientRadius = radius - gradientLength / 2;
    var outerGradientRadius = radius + gradientLength / 2;
    var gradientOffset = gradientLength / 2;

    var pad = new Node();

    // Create the gradient fills
    var highlightFill = new RadialGradient( gradientOffset, gradientOffset, innerGradientRadius, gradientOffset, gradientOffset, outerGradientRadius )
      .addColorStop( 0, baseColor )
      .addColorStop( 1, baseColor.colorUtilsBrighter( 0.7 ) );

    var shadowFill = new RadialGradient( -gradientOffset, -gradientOffset, innerGradientRadius, -gradientOffset, -gradientOffset, outerGradientRadius )
      .addColorStop( 0, transparentColor )
      .addColorStop( 1, baseColor.colorUtilsDarker( 0.5 ) );

    // base circle with white gradient
    var baseCircle = new Circle( radius, { fill: highlightFill } );
    pad.addChild( baseCircle );

    // black gradient
    var overlayForShadowGradient = new Circle( radius, { fill: shadowFill } );
    pad.addChild( overlayForShadowGradient );

    pad.mutate( options );
    return pad;
  };

  /**
   * @param {VoltmeterNode} voltmeterNode
   * @constructor
   */
  function VoltmeterWiresNode( voltmeterNode ) {
    var self = this;
    Node.call( this );

    var wireColor = '#353a89';
    var wireWidth = 3;

    // variables, used for measuring pads too
    var leftWireX = VOLTMETER_POSITION.x + voltmeterNode.minusNode.centerX;
    var rightWireX = VOLTMETER_POSITION.x + voltmeterNode.plusNode.centerX;
    var wireTop = VOLTMETER_POSITION.y + voltmeterNode.height / 2;

    // wires goes not to exactly to bulb position, need small deltas
    var leftWireBottom = BULB_POSITION.y - 23;
    var rightWireBottom = BULB_POSITION.y - 10;

    this.addChild( new Path( new Shape()
      .moveTo( leftWireX, wireTop )
      .lineTo( leftWireX, leftWireBottom ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    this.addChild( new Path( new Shape()
      .moveTo( rightWireX, wireTop )
      .lineTo( rightWireX, rightWireBottom ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    this.addChild( createPad( {
      centerX: leftWireX,
      centerY: leftWireBottom
    } ) );

    this.addChild( createPad( {
      centerX: rightWireX,
      centerY: rightWireBottom
    } ) );

    // For PhET-iO, synchronize visibility with the VoltmeterNode
    var updateVisible = function() {
      self.visible = voltmeterNode.visible;
    };
    voltmeterNode.on( 'visibility', updateVisible );
    updateVisible();
  }

  faradaysLaw.register( 'VoltmeterWiresNode', VoltmeterWiresNode );

  return inherit( Node, VoltmeterWiresNode );
} );
