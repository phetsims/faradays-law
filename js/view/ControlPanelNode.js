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
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var FlipMagnetButton = require('FARADAYS_LAW/view/buttons/FlipMagnetButton');

  function ControlPanelNode( model ) {
    Node.call( this );

    //reset
    this.addChild( new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 10,
      bottom: model.height - 10,
      scale: 0.75
    } ) );

    //flip magnet button
    this.addChild( new FlipMagnetButton({
      listener: function() {
        model.magnetModel.flipped = !model.magnetModel.flipped;
      },
      bottom: model.height - 9,
      right: model.width - 110,
      opacity:0.5
    }) );

  }

  return inherit( Node, ControlPanelNode );
} );