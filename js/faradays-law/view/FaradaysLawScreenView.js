// Copyright 2014-2018, University of Colorado Boulder

/**
 * Scene graph for the 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BulbNode = require( 'FARADAYS_LAW/faradays-law/view/BulbNode' );
  var CircuitDescriptionNode = require( 'FARADAYS_LAW/faradays-law/view/CircuitDescriptionNode' );
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilsWiresNode = require( 'FARADAYS_LAW/faradays-law/view/CoilsWiresNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var ControlPanelNode = require( 'FARADAYS_LAW/faradays-law/view/ControlPanelNode' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MagnetNodeWithField = require( 'FARADAYS_LAW/faradays-law/view/MagnetNodeWithField' );
  var PlayAreaNode = require( 'SCENERY_PHET/accessibility/nodes/PlayAreaNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Path = require( 'SCENERY/nodes/Path' );
  var ScreenView = require( 'JOIST/ScreenView' );
  // var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterAndWiresNode = require( 'FARADAYS_LAW/faradays-law/view/VoltmeterAndWiresNode' );

  // strings
  var summaryDescriptionString = FaradaysLawA11yStrings.summaryDescription.value;
  var moveMagnetToPlayString = FaradaysLawA11yStrings.moveMagnetToPlay.value;

  /**
   * @param {FaradaysLawModel} model - Faraday's Law simulation model object
   * @param {Tandem} tandem
   * @constructor
   */
  function FaradaysLawScreenView( model, tandem ) {
    ScreenView.call( this, {
      layoutBounds: FaradaysLawConstants.LAYOUT_BOUNDS,

      // a11y - TODO: Remove once https://github.com/phetsims/scenery-phet/issues/393 is complete
      addScreenSummaryNode: true
    } );

    // screen Summary
    var summaryNode = new Node();
    summaryNode.addChild( new Node( { tagName: 'p', innerContent: summaryDescriptionString } ) );
    summaryNode.addChild( new Node( { tagName: 'p', innerContent: moveMagnetToPlayString } ) );

    var playArea = new PlayAreaNode( { containerTagName: null } );

    var circuitDescriptionNode = new CircuitDescriptionNode( model );

    playArea.addChild( circuitDescriptionNode );

    this.screenSummaryNode.addChild( summaryNode );
    this.addChild( playArea );

    // coils
    var bottomCoilNode = new CoilNode( CoilTypeEnum.FOUR_COIL, {
      x: model.bottomCoil.position.x,
      y: model.bottomCoil.position.y
    } );

    var topCoilNode = new CoilNode( CoilTypeEnum.TWO_COIL, {
      x: model.topCoil.position.x,
      y: model.topCoil.position.y
    } );

    // @public {Vector2[]}
    this.bottomCoilEndPositions = {
      topEnd: bottomCoilNode.endRelativePositions.topEnd.plus( model.bottomCoil.position ),
      bottomEnd: bottomCoilNode.endRelativePositions.bottomEnd.plus( model.bottomCoil.position )
    };

    // @public {Vector2[]}
    this.topCoilEndPositions = {
      topEnd: topCoilNode.endRelativePositions.topEnd.plus( model.topCoil.position ),
      bottomEnd: topCoilNode.endRelativePositions.bottomEnd.plus( model.topCoil.position )
    };

    // voltmeter and bulb created
    var voltmeterAndWiresNode = new VoltmeterAndWiresNode( model.voltmeter.needleAngleProperty, tandem.createTandem( 'voltmeterNode' ) );
    var bulbNode = new BulbNode( model.voltageProperty, {
      center: FaradaysLawConstants.BULB_POSITION
    } );

    // wires
    this.addChild( new CoilsWiresNode( this, model.topCoilVisibleProperty ) );

    // exists for the lifetime of the sim, no need to dispose
    model.voltmeterVisibleProperty.link( function( showVoltmeter ) {
      voltmeterAndWiresNode.visible = showVoltmeter;
    } );

    // When the PhET-iO studio makes the voltmeter invisible, we should also uncheck the checkbox.
    voltmeterAndWiresNode.on( 'visibility', function() {
      model.voltmeterVisibleProperty.value = voltmeterAndWiresNode.visible;
    } );

    // bulb added
    this.addChild( bulbNode );

    // coils added
    this.addChild( bottomCoilNode );
    this.addChild( topCoilNode );
    model.topCoilVisibleProperty.linkAttribute( topCoilNode, 'visible' );

    // control panel
    var controlPanel = new ControlPanelNode( model, tandem );
    this.addChild( controlPanel );

    // voltmeter added
    this.addChild( voltmeterAndWiresNode );

    // @private
    this.magnetNodeWithField = new MagnetNodeWithField( model, tandem.createTandem( 'magnetNode' ) );
    this.addChild( this.magnetNodeWithField );

    // a11y keyboard nav order
    this.accessibleOrder = [
      this.screenSummaryNode,
      playArea,
      this.magnetNodeWithField,
      controlPanel
    ];

    // move coils to front
    bottomCoilNode.frontImage.detach();
    this.addChild( bottomCoilNode.frontImage );
    bottomCoilNode.frontImage.center = model.bottomCoil.position.plus( new Vector2( CoilNode.xOffset, 0 ) );

    topCoilNode.frontImage.detach();
    this.addChild( topCoilNode.frontImage );
    topCoilNode.frontImage.center = model.topCoil.position.plus( new Vector2( CoilNode.xOffset + CoilNode.twoOffset, 0 ) );
    model.topCoilVisibleProperty.linkAttribute( topCoilNode.frontImage, 'visible' );
  }

  faradaysLaw.register( 'FaradaysLawScreenView', FaradaysLawScreenView );

  return inherit( ScreenView, FaradaysLawScreenView, {

    /**
     * Step in time
     * @param {number} dt - elapsed time in seconds
     */
    step: function( dt ) {
      // this.magnetNodeWithField.step( dt );
    }
  } );
} );