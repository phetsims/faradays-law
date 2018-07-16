// Copyright 2014-2018, University of Colorado Boulder

/**
 * Strip of controls at the bottom of the screen, which are not shown in a visible panel.  It contains controls
 * for showing field lines, switching between 1 vs 2 coils, flipping the magnet and the reset all button.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FlipMagnetButton = require( 'FARADAYS_LAW/faradays-law/view/FlipMagnetButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var faradaysLawShowFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );

  /**
   * @param {FaradaysLawModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPanelNode( model, tandem ) {
    Node.call( this );

    // reset button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.bounds.maxX - 10,
      bottom: 0,
      scale: 0.75,
      touchAreaDilation: 10,
      tandem: tandem.createTandem( 'resetAllButton' ),
    } );
    this.addChild( resetAllButton );

    // flip magnet button
    var flipMagnetButton = new FlipMagnetButton( tandem.createTandem( 'flipMagnetButton' ), {
      listener: function() {
        model.magnet.orientationProperty.set( OrientationEnum.opposite( model.magnet.orientationProperty.get() ) );
      },
      bottom: 0,
      right: model.bounds.maxX - 110
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
          new CoilNode( CoilTypeEnum.TWO_COIL, { visible: false } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'singleCoilRadioButton',
      phetioInstanceDocumentation: 'Radio button that selects a single coil.'
    }, {
      value: true,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL ),
          new CoilNode( CoilTypeEnum.FOUR_COIL )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'doubleCoilRadioButton',
      phetioInstanceDocumentation: 'Radio button that selects double coils.'
    } ];

    var coilRadioButtonGroup = new RadioButtonGroup( model.showTopCoilProperty, coilButtonGroupContents, {
      buttonContentXMargin: 20,
      buttonContentYMargin: 4,
      left: 377,
      bottom: 0,
      orientation: 'horizontal',
      baseColor: '#cdd5f6', // lavender-ish
      selectedLineWidth: 3,
      deselectedLineWidth: 1,
      tandem: tandem.createTandem( 'coilRadioButtonGroup' ),
      phetioInstanceDocumentation: 'Radio button group that selects between one or two coils.'
    } );

    this.addChild( coilRadioButtonGroup );

    var showVoltmeterLabel = new Text( 'Volt Meter', { font: new PhetFont( 16 ) } );
    showVoltmeterLabel.scale( Math.min( 150 / showVoltmeterLabel.width, 1 ) );

    var showVoltmeterCheckbox = new Checkbox( showVoltmeterLabel, model.showVoltmeterProperty, {
      x: 174,
      centerY: coilRadioButtonGroup.centerY - 20,
      tandem: tandem.createTandem( 'showVoltmeterCheckbox' ),
      phetioInstanceDocumentation: 'Checkbox that selects whether the voltmeter will be shown.'
    } );
    showVoltmeterCheckbox.touchArea = showVoltmeterCheckbox.localBounds.dilated( 8 );
    this.addChild( showVoltmeterCheckbox );

    // Create the label for the "Show Field Lines" checkbox, scaling it if it's too long.
    var showFieldLinesLabel = new Text( faradaysLawShowFieldLinesString, { font: new PhetFont( 16 ) } );
    showFieldLinesLabel.scale( Math.min( 150 / showFieldLinesLabel.width, 1 ) ); // max width empirically determined

    // show field lines
    var showFieldCheckbox = new Checkbox( showFieldLinesLabel, model.magnet.showFieldLinesProperty, {
      x: 174,
      centerY: coilRadioButtonGroup.centerY + 20,
      tandem: tandem.createTandem( 'showFieldCheckbox' ),
      phetioInstanceDocumentation: 'Checkbox that selects whether the magnetic fields lines will be shown.'
    } );
    showFieldCheckbox.touchArea = showFieldCheckbox.localBounds.dilated( 8 );
    this.addChild( showFieldCheckbox );

    this.bottom = model.bounds.maxY - 10;

    // a11y keyboard nav order
    this.accessibleOrder = [
      showVoltmeterCheckbox,
      showFieldCheckbox,
      coilRadioButtonGroup,
      flipMagnetButton,
      resetAllButton
    ];
  }

  faradaysLaw.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );
} );