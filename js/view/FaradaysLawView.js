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
    var coil1Node = new CoilNode( CoilTypeEnum.FOUR_COIL, {
      x: model.coil1.position.x,
      y: model.coil1.position.y
    } );
    this.addChild( coil1Node );

    var coil2Node = new CoilNode( CoilTypeEnum.TWO_COIL, {
      x: model.coil2.position.x,
      y: model.coil2.position.y
    } );
    this.addChild( coil2Node );
    model.showSecondCoilProperty.linkAttribute( coil2Node, 'visible' );

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
    coil1Node.frontImage.detach();
    this.addChild( coil1Node.frontImage );
    coil1Node.frontImage.center = model.coil1.position.plus( new Vector2( CoilNode.xOffset, 0 ) );

    coil2Node.frontImage.detach();
    this.addChild( coil2Node.frontImage );
    coil2Node.frontImage.center = model.coil2.position.plus( new Vector2( CoilNode.xOffset + CoilNode.twoOffset, 0 ) );
    model.showSecondCoilProperty.linkAttribute( coil2Node.frontImage, 'visible' );
  }

  return inherit( ScreenView, FaradaysLawView, {
  } );
} )
;
