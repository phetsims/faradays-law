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
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FlipMagnetButton = require( 'FARADAYS_LAW/view/buttons/FlipMagnetButton' );

  // strings
  var showFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );

  function ControlPanelNode( model ) {
    Node.call( this );

    // reset
    this.addChild( new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 10,
      bottom: model.height - 10,
      scale: 0.75
    } ) );

    // flip magnet button
    this.addChild( new FlipMagnetButton( {
      listener: function() {
        model.magnetModel.flipped = !model.magnetModel.flipped;
      },
      bottom: model.height - 9,
      right: model.width - 110,
      opacity: 0.5
    } ) );

    // show field lines
    this.addChild( new CheckBox( new Text( showFieldLinesString, {font: new PhetFont( 16 )} ), model.magnetModel.showFieldLinesProperty , {
      x: 174,
      bottom: model.height-37
    } ));


  }

  return inherit( Node, ControlPanelNode );
} );