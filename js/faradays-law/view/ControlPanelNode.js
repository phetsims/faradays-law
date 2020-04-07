// Copyright 2014-2020, University of Colorado Boulder

/**
 * Strip of controls at the bottom of the screen, which are not shown in a visible panel.  It contains controls
 * for showing field lines, switching between 1 vs 2 coils, flipping the magnet and the reset all button.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import faradaysLawStrings from '../../faradaysLawStrings.js';
import faradaysLaw from '../../faradaysLaw.js';
import OrientationEnum from '../model/OrientationEnum.js';
import CoilNode from './CoilNode.js';
import CoilTypeEnum from './CoilTypeEnum.js';
import FaradaysLawAlertManager from './FaradaysLawAlertManager.js';
import FlipMagnetButton from './FlipMagnetButton.js';

const faradaysLawShowFieldLinesString = faradaysLawStrings[ 'faradays-law' ].showFieldLines;
const faradaysLawVoltmeterString = faradaysLawStrings[ 'faradays-law' ].voltmeter;
const voltmeterString = faradaysLawStrings.a11y.voltmeter;
const voltmeterDescriptionString = faradaysLawStrings.a11y.voltmeterDescription;
const numberOneCoilString = faradaysLawStrings.a11y.numberOneCoil;
const numberTwoCoilString = faradaysLawStrings.a11y.numberTwoCoil;
const circuitModeString = faradaysLawStrings.a11y.circuitMode;
const fieldLinesString = faradaysLawStrings.a11y.fieldLines;
const fieldLinesDescriptionString = faradaysLawStrings.a11y.fieldLinesDescription;

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

    // pdom
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
    // phet.joist.sim.utteranceQueue.addToBack( StringUtils.fillIn( voltmeterAlertPatternString, { attachmentState } ) );
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

  // pdom keyboard nav order
  this.accessibleOrder = [
    voltmeterCheckbox,
    fieldLinesCheckbox,
    coilRadioButtonGroup
  ];
}

faradaysLaw.register( 'ControlPanelNode', ControlPanelNode );

inherit( Node, ControlPanelNode );
export default ControlPanelNode;