// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control panel for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FlipMagnetButton = require( 'FARADAYS_LAW/faradays-law/view/buttons/FlipMagnetButton' );
  var ShowCoilsButtonGroup = require( 'FARADAYS_LAW/faradays-law/view/buttons/ShowCoilsButtonGroup' );

  // strings
  var showFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );

  /**
   *
   * @param model - 'Faradays Law' simulation model
   * @constructor
   */
  function ControlPanelNode( model ) {
    var self = this;
    Node.call( this );

    // reset button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 10,
      bottom: 0,
      scale: 0.75,
      touchExpansion: 10,
    } );
    this.addChild( resetAllButton );

    // flip magnet button
    var flipMagnetButton = new FlipMagnetButton( {
      listener: function() {
        model.magnetModel.flipped = !model.magnetModel.flipped;
      },
      bottom: 0,
      right: model.width - 110
    } );
    this.addChild( flipMagnetButton );

    // show/hide second coil
    this.addChild( new ShowCoilsButtonGroup( model.showSecondCoilProperty, {
      x: 377,
      bottom: 0
    } ) );

    // show field lines
    var showFieldCheckBox = new CheckBox( new Text( showFieldLinesString, { font: new PhetFont( 16 ) } ), model.magnetModel.showFieldLinesProperty, {
      x: 174,
      centerY: self.centerY,
    } );
    showFieldCheckBox.touchArea = showFieldCheckBox.localBounds.dilated( 8 );
    this.addChild( showFieldCheckBox );

    this.bottom = model.height - 10;

    // Together support
    together && together.addComponent( resetAllButton, 'faradaysLawScreen.resetAllButton' );
    together && together.addComponent( showFieldCheckBox, 'faradaysLawScreen.showFieldCheckBox' );
    together && together.addComponent( flipMagnetButton, 'faradaysLawScreen.flipMagnetButton' );
  }

  return inherit( Node, ControlPanelNode );
} );