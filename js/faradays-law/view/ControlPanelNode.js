// Copyright 2014-2017, University of Colorado Boulder

/**
 * Control panel for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FlipMagnetButton = require( 'FARADAYS_LAW/faradays-law/view/buttons/FlipMagnetButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var faradaysLawShowFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );

  /**
   * @param model - 'Faradays Law' simulation model
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPanelNode( model, tandem ) {
    Node.call( this );

    // reset button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 10,
      bottom: 0,
      scale: 0.75,
      touchAreaDilation: 10,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // flip magnet button
    var flipMagnetButton = new FlipMagnetButton( tandem.createTandem( 'flipMagnetButton' ), {
      listener: function() {
        model.magnetModel.flippedProperty.set( !model.magnetModel.flippedProperty.get() );
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
      }, coilButtonGroupOptions ) ),
      tandemName: 'singleCoilRadioButton'
    }, {
      value: true,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL, { isSmall: true } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL, { isSmall: true } )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'doubleCoilRadioButton'
    } ];

    var coilSelectionRadioButtonGroup = new RadioButtonGroup( model.showSecondCoilProperty, coilButtonGroupContents, {
      buttonContentXMargin: 20,
      buttonContentYMargin: 4,
      left: 377,
      bottom: 0,
      orientation: 'horizontal',
      baseColor: '#cdd5f6', // lavender-ish
      selectedLineWidth: 3,
      deselectedLineWidth: 1,
      tandem: tandem.createTandem( 'radioButtonGroup')
    } );

    this.addChild( coilSelectionRadioButtonGroup );

    // Create the label for the "Show Field Lines" check box, scaling it if it's too long.
    var showFieldLinesLabel = new Text( faradaysLawShowFieldLinesString, { font: new PhetFont( 16 ) } );
    showFieldLinesLabel.scale( Math.min( 150 / showFieldLinesLabel.width, 1 ) ); // max width empirically determined

    // show field lines
    var showFieldCheckBox = new CheckBox( showFieldLinesLabel, model.magnetModel.showFieldLinesProperty, {
      x: 174,
      centerY: coilSelectionRadioButtonGroup.centerY,
      tandem: tandem.createTandem( 'showFieldCheckBox' )
    } );
    showFieldCheckBox.touchArea = showFieldCheckBox.localBounds.dilated( 8 );
    this.addChild( showFieldCheckBox );

    this.bottom = model.height - 10;
  }

  faradaysLaw.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );
} );