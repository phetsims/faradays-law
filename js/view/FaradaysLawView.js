// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var CoilNode = require( 'FARADAYS_LAW/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/view/CoilTypeEnum' );
  var Image = require( 'SCENERY/nodes/Image' );
  var MagnetNodeWithField = require( 'FARADAYS_LAW/view/MagnetNodeWithField' );
  var ControlPanelNode = require( 'FARADAYS_LAW/view/ControlPanelNode' );
  var BulbNode = require( 'FARADAYS_LAW/view/BulbNode' );
  var CoilsWiresNode = require( 'FARADAYS_LAW/view/CoilsWiresNode' );
  var VoltMeterWiresNode = require( 'FARADAYS_LAW/view/VoltMeterWiresNode' );
  var VoltMeterNode = require( 'FARADAYS_LAW/view/VoltMeterNode' );


  var backImage = require( 'image!FARADAYS_LAW/images/image06.png' );

  /**
   * @param {gameModel} model - Faradays law simulation model object
   * @constructor
   */
  function FaradaysLawView( model ) {
    ScreenView.call( this, {
      renderer: 'svg',
      layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS
    } );

    this.addChild( new CoilsWiresNode( model.showSecondCoilProperty ) );
    this.addChild( new VoltMeterWiresNode() );

    this.addChild( new BulbNode( model.voltMeterModel.thetaProperty, {
      x: 145,
      y: 244
    } ) );

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
    model.showSecondCoilProperty.linkAttribute( coil2Node, "visible" );


    this.addChild( new ControlPanelNode( model ) );
    this.addChild( new MagnetNodeWithField( model.magnetModel ) );

    var voltMeterNode = new VoltMeterNode( model.voltMeterModel.thetaProperty, {} );
    voltMeterNode.top = 16;
    voltMeterNode.left = 105;
    this.addChild( voltMeterNode );

  }

  return inherit( ScreenView, FaradaysLawView, {
  } );
} )
;
