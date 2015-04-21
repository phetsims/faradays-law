// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control panel for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FlipMagnetButton = require( 'FARADAYS_LAW/faradays-law/view/buttons/FlipMagnetButton' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var showFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );

  /**
   * @param model - 'Faradays Law' simulation model
   * @param {Tandem} tandem - support for exporting elements from the sim
   * @constructor
   */
  function ControlPanelNode( model, tandem ) {
    var self = this;
    Node.call( this );

    // reset button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 10,
      bottom: 0,
      scale: 0.75,
      touchExpansion: 10
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

    // add radio button group for showing/hiding the second coil
    var coilButtonGroupOptions = {
      spacing: 10,
      align: 'left',
      scale: 0.21
    };

    var coilButtonGroupContents = [ {
      value: false,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL, { isSmall: true, visible: false } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL, { isSmall: true } )
        ]
      }, coilButtonGroupOptions ) )
    }, {
      value: true,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL, { isSmall: true } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL, { isSmall: true } )
        ]
      }, coilButtonGroupOptions ) )
    } ];

    var coilSelectionRadioButtonGroup = new RadioButtonGroup( model.showSecondCoilProperty, coilButtonGroupContents, {
      buttonContentXMargin: 20,
      buttonContentYMargin: 4,
      left: 377,
      bottom: 0,
      orientation: 'horizontal',
      baseColor: '#cdd5f6', // lavender-ish
      selectedLineWidth: 3,
      deselectedLineWidth: 1
    } );

    this.addChild( coilSelectionRadioButtonGroup );

    // together.js support
    var singleCoilRadioButton = coilSelectionRadioButtonGroup.getRadioButtonGroupMember( false );
    var doubleCoilRadioButton = coilSelectionRadioButtonGroup.getRadioButtonGroupMember( true );

    // show field lines
    var showFieldCheckBox = new CheckBox( new Text( showFieldLinesString, { font: new PhetFont( 16 ) } ), model.magnetModel.showFieldLinesProperty, {
      x: 174,
      centerY: self.centerY
    } );
    showFieldCheckBox.touchArea = showFieldCheckBox.localBounds.dilated( 8 );
    this.addChild( showFieldCheckBox );

    this.bottom = model.height - 10;

    // tandem/together support
    tandem && tandem.createTandem( 'singleCoilRadioButton' ).addInstance( singleCoilRadioButton );
    tandem && tandem.createTandem( 'doubleCoilRadioButton' ).addInstance( doubleCoilRadioButton );
    tandem && tandem.createTandem( 'resetAllButton' ).addInstance( resetAllButton );
    tandem && tandem.createTandem( 'showFieldCheckBox' ).addInstance( showFieldCheckBox );
    tandem && tandem.createTandem( 'flipMagnetButton' ).addInstance( flipMagnetButton );
  }

  return inherit( Node, ControlPanelNode );
} );