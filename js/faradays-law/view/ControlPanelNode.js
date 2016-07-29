// Copyright 2014-2015, University of Colorado Boulder

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
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

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
      }, coilButtonGroupOptions ) ),
      tandem: tandem.createTandem( 'singleCoilRadioButton' ),
      phetioValueType: TBoolean
    }, {
      value: true,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL, { isSmall: true } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL, { isSmall: true } )
        ]
      }, coilButtonGroupOptions ) ),
      tandem: tandem.createTandem( 'doubleCoilRadioButton' ),
      phetioValueType: TBoolean
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