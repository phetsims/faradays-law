// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var MagnetNodeWithField = require( 'FARADAYS_LAW/faradays-law/view/MagnetNodeWithField' );
  var ControlPanelNode = require( 'FARADAYS_LAW/faradays-law/view/ControlPanelNode' );
  var BulbNode = require( 'FARADAYS_LAW/faradays-law/view/BulbNode' );
  var CoilsWiresNode = require( 'FARADAYS_LAW/faradays-law/view/CoilsWiresNode' );
  var VoltMeterWiresNode = require( 'FARADAYS_LAW/faradays-law/view/VoltMeterWiresNode' );
  var VoltMeterNode = require( 'FARADAYS_LAW/faradays-law/view/VoltMeterNode' );
  var Aligner = require( 'FARADAYS_LAW/faradays-law/view/Aligner' );

  /**
   * @param {gameModel} model - Faraday's Law simulation model object
   * @constructor
   */
  function FaradaysLawView( model, tandem ) {
    ScreenView.call( this, {
      layoutBounds: FaradaysLawConstants.LAYOUT_BOUNDS
    } );

    // coils
    var bottomCoilNode = new CoilNode( CoilTypeEnum.FOUR_COIL, {
      x: model.bottomCoil.position.x,
      y: model.bottomCoil.position.y
    } );

    var topCoilNode = new CoilNode( CoilTypeEnum.TWO_COIL, {
      x: model.topCoil.position.x,
      y: model.topCoil.position.y
    } );

    // aligner
    this.aligner = new Aligner( model, bottomCoilNode.endRelativePositions, topCoilNode.endRelativePositions );

    // voltmeter and bulb created
    var voltMeterNode = new VoltMeterNode( model.voltMeterModel.thetaProperty, {} );
    var bulbNode = new BulbNode( model.voltMeterModel.thetaProperty, {
      centerX: this.aligner.bulbPosition.x,
      centerY: this.aligner.bulbPosition.y
    } );

    // wires
    this.addChild( new CoilsWiresNode( this.aligner, model.showSecondCoilProperty ) );
    this.addChild( new VoltMeterWiresNode( this.aligner, voltMeterNode ) );

    // bulb added
    this.addChild( bulbNode );

    // coils added
    this.addChild( bottomCoilNode );
    this.addChild( topCoilNode );
    model.showSecondCoilProperty.linkAttribute( topCoilNode, 'visible' );

    // control panel
    this.addChild( new ControlPanelNode( model, tandem ) );

    // voltmeter added
    voltMeterNode.center = this.aligner.voltmeterPosition;
    this.addChild( voltMeterNode );

    // magnet
    this.addChild( new MagnetNodeWithField( model, tandem.createTandem( 'magnet' ) ) );

    // move coils to front
    bottomCoilNode.frontImage.detach();
    this.addChild( bottomCoilNode.frontImage );
    bottomCoilNode.frontImage.center = model.bottomCoil.position.plus( new Vector2( CoilNode.xOffset, 0 ) );

    topCoilNode.frontImage.detach();
    this.addChild( topCoilNode.frontImage );
    topCoilNode.frontImage.center = model.topCoil.position.plus( new Vector2( CoilNode.xOffset + CoilNode.twoOffset, 0 ) );
    model.showSecondCoilProperty.linkAttribute( topCoilNode.frontImage, 'visible' );
  }

  return inherit( ScreenView, FaradaysLawView, {} );
} )
;
