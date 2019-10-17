// Copyright 2014-2019, University of Colorado Boulder

/**
 * Strip of controls at the bottom of the screen, which are not shown in a visible panel.  It contains controls
 * for showing field lines, switching between 1 vs 2 coils, flipping the magnet and the reset all button.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  const CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  const FaradaysLawAlertManager = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawAlertManager' );
  const FlipMagnetButton = require( 'FARADAYS_LAW/faradays-law/view/FlipMagnetButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const faradaysLawShowFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );
  const faradaysLawVoltmeterString = require( 'string!FARADAYS_LAW/faradays-law.voltmeter' );

  // a11y strings
  const voltmeterString = FaradaysLawA11yStrings.voltmeter.value;
  const voltmeterDescriptionString = FaradaysLawA11yStrings.voltmeterDescription.value;
  const numberOneCoilString = FaradaysLawA11yStrings.numberOneCoil.value;
  const numberTwoCoilString = FaradaysLawA11yStrings.numberTwoCoil.value;
  const circuitModeString = FaradaysLawA11yStrings.circuitMode.value;
  const fieldLinesString = FaradaysLawA11yStrings.fieldLines.value;
  const fieldLinesDescriptionString = FaradaysLawA11yStrings.fieldLinesDescription.value;

  /**
   * @param {FaradaysLawModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPanelNode( model, tandem ) {

    Node.call( this, {
      tagName: 'ul'
    } );

    // reset button - added at end of constructor for a11y ordering
    const resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.bounds.maxX - 10,
      bottom: 0,
      scale: 0.75,

      // a11y
      containerTagName: 'li',

      // phet-io
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // flip magnet button
    this.flipMagnetButton = new FlipMagnetButton( tandem.createTandem( 'flipMagnetButton' ), {
      listener: function() {
        model.magnet.orientationProperty.set( OrientationEnum.opposite( model.magnet.orientationProperty.get() ) );
      },
      bottom: 0,
      right: model.bounds.maxX - 110
    } );
    this.addChild( this.flipMagnetButton );

    // add radio button group for showing/hiding the second coil
    const coilButtonGroupOptions = {
      spacing: 10,
      align: 'left',
      scale: 0.21
    };

    const coilButtonGroupContents = [ {
      value: false,
      node: new VBox( merge( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL, { visible: false } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'singleCoilRadioButton',
      phetioDocumentation: 'Radio button that selects a single coil.',
      labelContent: numberOneCoilString
    }, {
      value: true,// var coilRadioButtonsItem = new Node( {
      //   containerTagName: 'li',
      //   tagName: 'div',
      //   labelContent: 'Circuit Mode:'
      // } );

      // this.addChild( coilRadioButtonsItem );
      node: new VBox( merge( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL ),
          new CoilNode( CoilTypeEnum.FOUR_COIL )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'doubleCoilRadioButton',
      phetioDocumentation: 'Radio button that selects double coils.',
      labelContent: numberTwoCoilString
    } ];

    const coilRadioButtonGroup = new RadioButtonGroup( model.topCoilVisibleProperty, coilButtonGroupContents, {
      buttonContentXMargin: 20,
      buttonContentYMargin: 4,
      left: 377,
      bottom: 0,
      orientation: 'horizontal',
      baseColor: '#cdd5f6', // lavender-ish
      selectedLineWidth: 3,
      deselectedLineWidth: 1,
      tandem: tandem.createTandem( 'coilRadioButtonGroup' ),
      phetioDocumentation: 'Radio button group that selects between one or two coils.',
      containerTagName: 'li',
      labelContent: circuitModeString
    } );

    model.topCoilVisibleProperty.lazyLink( function( showTopCoil ) {
      FaradaysLawAlertManager.coilConnectionAlert( showTopCoil );
    } );

    const showVoltmeterLabel = new Text( faradaysLawVoltmeterString, { font: new PhetFont( 16 ) } );
    showVoltmeterLabel.scale( Math.min( 150 / showVoltmeterLabel.width, 1 ) );

    const voltmeterCheckbox = new Checkbox( showVoltmeterLabel, model.voltmeterVisibleProperty, {
      x: 174,
      centerY: coilRadioButtonGroup.centerY - 20,
      tandem: tandem.createTandem( 'voltmeterCheckbox' ),
      phetioDocumentation: 'Checkbox that selects whether the voltmeter will be shown.',
      containerTagName: 'li',
      labelTagName: 'label',
      labelContent: voltmeterString,
      descriptionContent: voltmeterDescriptionString
    } );
    voltmeterCheckbox.touchArea = voltmeterCheckbox.localBounds.dilated( 8 );
    this.addChild( voltmeterCheckbox );

    model.voltmeterVisibleProperty.lazyLink( function( showVoltmeter ) {
      FaradaysLawAlertManager.voltmeterAttachmentAlert( showVoltmeter );
      // const attachmentState = showVoltmeter ? connectedString : removedString;
      // utteranceQueue.addToBack( StringUtils.fillIn( voltmeterAlertPatternString, { attachmentState } ) );
    } );

    // Create the label for the "Show Field Lines" checkbox, scaling it if it's too long.
    const showFieldLinesLabel = new Text( faradaysLawShowFieldLinesString, { font: new PhetFont( 16 ) } );
    showFieldLinesLabel.scale( Math.min( 150 / showFieldLinesLabel.width, 1 ) ); // max width empirically determined

    // show field lines
    const fieldLinesCheckbox = new Checkbox( showFieldLinesLabel, model.magnet.fieldLinesVisibleProperty, {
      x: 174,
      centerY: coilRadioButtonGroup.centerY + 20,
      tandem: tandem.createTandem( 'fieldLinesCheckbox' ),
      phetioDocumentation: 'Checkbox that selects whether the magnetic field lines will be shown.',
      containerTagName: 'li',
      labelTagName: 'label',
      labelContent: fieldLinesString,
      descriptionContent: fieldLinesDescriptionString
    } );
    fieldLinesCheckbox.touchArea = fieldLinesCheckbox.localBounds.dilated( 8 );
    this.addChild( fieldLinesCheckbox );

    model.magnet.fieldLinesVisibleProperty.lazyLink( showLines => {
      FaradaysLawAlertManager.fieldLinesVisibilityAlert( showLines );
    } );

    this.addChild( coilRadioButtonGroup );

    // for a11y ordering
    this.addChild( resetAllButton );

    this.bottom = model.bounds.maxY - 10;

    // a11y keyboard nav order
    this.accessibleOrder = [
      voltmeterCheckbox,
      fieldLinesCheckbox,
      coilRadioButtonGroup
    ];
  }

  faradaysLaw.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );
} );
