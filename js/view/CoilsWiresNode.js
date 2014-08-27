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
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );



  function CoilsWiresNode( showSecondCoilProperty ) {
    Node.call( this );

    var wireColor = "#7f3521";
    var wireWidth = 3;

    var leftWireX = 175; //x coordinate for left most vertical wire, also used for top coil wire
    var rightWireX = 202; //x coordinate for second vertical wire, also used for top coil wire to make arc

    //bottom coil, static wires
    this.addChild( new Path( new Shape()
      .moveTo( leftWireX, 250 )
      .lineTo( leftWireX, 324 )
      .lineTo( 520, 324 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    this.addChild( new Path( new Shape()
      .moveTo( rightWireX, 250 )
      .lineTo( rightWireX, 308 )
      .lineTo( 450, 308 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } ) );

    //top coil wires, must be hidden if coil is hidden
    var secondCoilsWire1 = new Path( new Shape()
      .moveTo( rightWireX, 260 )
      .lineTo( 335, 260 )
      .lineTo( 335, 131 )
      .lineTo( 450, 131 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } );
    this.addChild( secondCoilsWire1 );

    var secondCoilsWire2 = new Path( new Shape()
      .moveTo( leftWireX, 277 )
      .lineTo( rightWireX-8, 277 )
      .arc( rightWireX, 277, 8, Math.PI, 0, true )
      .lineTo( 350, 277 )
      .lineTo( 350, 147 )
      .lineTo( 480, 147 ), {
      stroke: wireColor,
      lineWidth: wireWidth
    } );
    this.addChild( secondCoilsWire2 );

    showSecondCoilProperty.linkAttribute( secondCoilsWire1, "visible" );
    showSecondCoilProperty.linkAttribute( secondCoilsWire2, "visible" );

  }

  return inherit( Node, CoilsWiresNode );
} )
;
