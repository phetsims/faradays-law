// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var FaradaysLawConstants = require( 'FARADAYS_LAW/FaradaysLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var CoilNode = require( 'FARADAYS_LAW/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/view/CoilTypeEnum' );
  var MagnetNodeWithField = require( 'FARADAYS_LAW/view/MagnetNodeWithField' );
  var ControlPanelNode = require( 'FARADAYS_LAW/view/ControlPanelNode' );
  var BulbNode = require( 'FARADAYS_LAW/view/BulbNode' );
  var CoilsWiresNode = require( 'FARADAYS_LAW/view/CoilsWiresNode' );
  var VoltMeterWiresNode = require( 'FARADAYS_LAW/view/VoltMeterWiresNode' );
  var VoltMeterNode = require( 'FARADAYS_LAW/view/VoltMeterNode' );

  /**
   * @param {gameModel} model - Faraday's Law simulation model object
   * @constructor
   */
  function FaradaysLawView( model ) {
    ScreenView.call( this, {
      renderer: 'svg',
      layoutBounds: FaradaysLawConstants.LAYOUT_BOUNDS
    } );

    // wires
    this.addChild( new CoilsWiresNode( model.showSecondCoilProperty ) );
    this.addChild( new VoltMeterWiresNode() );

    // bulb
    this.addChild( new BulbNode( model.voltMeterModel.thetaProperty, {
      right: 208,
      centerY: 244
    } ) );

    // coils
    var bottomCoilNode = new CoilNode( CoilTypeEnum.FOUR_COIL, {
      x: model.bottomCoil.position.x,
      y: model.bottomCoil.position.y
    } );
    this.addChild( bottomCoilNode );

    var topCoilNode = new CoilNode( CoilTypeEnum.TWO_COIL, {
      x: model.topCoil.position.x,
      y: model.topCoil.position.y
    } );
    this.addChild( topCoilNode );
    model.showSecondCoilProperty.linkAttribute( topCoilNode, 'visible' );

    // control panel
    this.addChild( new ControlPanelNode( model ) );

    // voltmeter
    var voltMeterNode = new VoltMeterNode( model.voltMeterModel.thetaProperty, {} );
    voltMeterNode.top = 16;
    voltMeterNode.left = 105;
    this.addChild( voltMeterNode );

    // magnet
    this.addChild( new MagnetNodeWithField( model ) );

    // move coils to front
    bottomCoilNode.frontImage.detach();
    this.addChild( bottomCoilNode.frontImage );
    bottomCoilNode.frontImage.center = model.bottomCoil.position.plus( new Vector2( CoilNode.xOffset, 0 ) );

    topCoilNode.frontImage.detach();
    this.addChild( topCoilNode.frontImage );
    topCoilNode.frontImage.center = model.topCoil.position.plus( new Vector2( CoilNode.xOffset + CoilNode.twoOffset, 0 ) );
    model.showSecondCoilProperty.linkAttribute( topCoilNode.frontImage, 'visible' );
  }

  return inherit( ScreenView, FaradaysLawView, {
  } );
} )
;
