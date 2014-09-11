// Copyright 2002-2014, University of Colorado Boulder

/**
 * Wires for both coils.
 * 'Faradays Law' simulation.
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
  var ARC_RADIUS = 7;

  /**
   * @param showSecondCoilProperty
   * @constructor
   */
  function CoilsWiresNode( showSecondCoilProperty ) {
    Node.call( this );

    var wireColor = '#7f3521';
    var wireWidth = 3;

    // TODO: (from @jbphet) - This code contains a lot of 'magic numbers' that should be cleaned up.  These values
    // should relate to the positions of the light bulb and the coils in the view.

    var leftWireX = 175; //x coordinate for left most vertical wire, also used for top coil wire
    var rightWireX = 202; //x coordinate for second vertical wire, also used for top coil wire to make arc

    //bottom coil, static wires
    this.addChild( new Path( new Shape()
      .moveTo( leftWireX, 250 )
      .lineTo( leftWireX, 334 - ARC_RADIUS )
      .quadraticCurveTo( leftWireX, 334, leftWireX + ARC_RADIUS, 334 )
      .lineTo( 520, 334 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    this.addChild( new Path( new Shape()
      .moveTo( rightWireX, 250 )
      .lineTo( rightWireX, 318 - ARC_RADIUS )
      .quadraticCurveTo( rightWireX, 318, rightWireX + ARC_RADIUS, 318 )
      .lineTo( 450, 318 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    //top coil wires, must be hidden if coil is hidden
    var secondCoilsWire1 = new Path( new Shape()
      .moveTo( rightWireX, 260 )
      .lineTo( 335 - ARC_RADIUS, 260 )
      .quadraticCurveTo( 335, 260, 335, 260 - ARC_RADIUS )
      .lineTo( 335, 121 + ARC_RADIUS )
      .quadraticCurveTo( 335, 121, 335 + ARC_RADIUS, 121 )
      .lineTo( 450, 121 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } );
    this.addChild( secondCoilsWire1 );

    var secondCoilsWire2 = new Path( new Shape()
      .moveTo( leftWireX, 277 )
      .lineTo( rightWireX - 8, 277 )
      .arc( rightWireX, 277, 8, Math.PI, 0, true )
      .lineTo( 350 - ARC_RADIUS, 277 )
      .quadraticCurveTo( 350, 277, 350, 277 - ARC_RADIUS )
      .lineTo( 350, 137 + ARC_RADIUS )
      .quadraticCurveTo( 350, 137, 350 + ARC_RADIUS, 137 )
      .lineTo( 480, 137 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } );
    this.addChild( secondCoilsWire2 );

    showSecondCoilProperty.linkAttribute( secondCoilsWire1, 'visible' );
    showSecondCoilProperty.linkAttribute( secondCoilsWire2, 'visible' );

  }

  return inherit( Node, CoilsWiresNode );
} )
;
