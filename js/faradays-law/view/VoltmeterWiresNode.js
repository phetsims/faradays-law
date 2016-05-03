// Copyright 2014-2015, University of Colorado Boulder

/**
 * Voltmeter wires for 'Faradays Law' simulation model
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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

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
   * @param aligner
   * @param voltmeterBottom - y coordinate of the bottom of voltmeter
   * @constructor
   */
  function VoltmeterWiresNode( aligner, voltmeterNode ) {
    Node.call( this );

    var wireColor = '#353a89';
    var wireWidth = 3;

    // variables, used for measuring pads too
    var leftWireX = aligner.voltmeterPosition.x + voltmeterNode.minusNode.centerX;
    var rightWireX = aligner.voltmeterPosition.x + voltmeterNode.plusNode.centerX;
    var wireTop = aligner.voltmeterPosition.y + voltmeterNode.height / 2;

    // wires goes not to exactly to bulb position, need small deltas
    var leftWireBottom = aligner.bulbPosition.y - 23;
    var rightWireBottom = aligner.bulbPosition.y - 10;

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

  }

  faradaysLaw.register( 'VoltmeterWiresNode', VoltmeterWiresNode );
  
  return inherit( Node, VoltmeterWiresNode );
} );
