// Copyright 2014-2017, University of Colorado Boulder

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
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilsWiresNode = require( 'FARADAYS_LAW/faradays-law/view/CoilsWiresNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var ControlPanelNode = require( 'FARADAYS_LAW/faradays-law/view/ControlPanelNode' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MagnetNodeWithField = require( 'FARADAYS_LAW/faradays-law/view/MagnetNodeWithField' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'FARADAYS_LAW/faradays-law/view/VoltmeterNode' );
  var VoltmeterWiresNode = require( 'FARADAYS_LAW/faradays-law/view/VoltmeterWiresNode' );

  /**
   * @param {FaradaysLawModel} model - Faraday's Law simulation model object
   * @param {Tandem} tandem
   * @constructor
   */
  function FaradaysLawScreenView( model, tandem ) {
    ScreenView.call( this, {
      layoutBounds: FaradaysLawConstants.LAYOUT_BOUNDS
    } );

    var x = new Rectangle( 0, 0, 100, 100, { fill: 'red' } );
    this.addChild( x );

    var x = new Rectangle( 0, 0, 100, 100, { top: 150, fill: 'red', scale: 2 } );
    this.addChild( x );

    x = new HSlider( new Property( 0 ), { min: 0, max: 100 }, { top: 50 } );
    this.addChild( x );

    x = new HSlider( new Property( 0 ), { min: 0, max: 100 }, { top: 200, scale: 2 } );
    this.addChild( x );

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
    var voltmeterNode = new VoltmeterNode( model.voltmeter.needleAngleProperty, tandem.createTandem( 'voltmeterNode' ) );
    var bulbNode = new BulbNode( model.voltmeter.voltageProperty, {
      center: FaradaysLawConstants.BULB_POSITION
    } );

    // wires
    this.addChild( new CoilsWiresNode( this, model.showTopCoilProperty ) );
    this.addChild( new VoltmeterWiresNode( voltmeterNode ) );

    // bulb added
    this.addChild( bulbNode );

    // coils added
    this.addChild( bottomCoilNode );
    this.addChild( topCoilNode );
    model.showTopCoilProperty.linkAttribute( topCoilNode, 'visible' );

    // control panel
    var controlPanel = new ControlPanelNode( model, tandem.createTandem( 'controlPanel' ) );
    this.addChild( controlPanel );

    // voltmeter added
    voltmeterNode.center = FaradaysLawConstants.VOLTMETER_POSITION;
    this.addChild( voltmeterNode );

    // @private
    this.magnetNodeWithField = new MagnetNodeWithField( model, tandem.createTandem( 'magnet' ) );
    this.addChild( this.magnetNodeWithField );

    // a11y keyboard nav order
    this.accessibleOrder = [ this.magnetNodeWithField, controlPanel ];

    // move coils to front
    bottomCoilNode.frontImage.detach();
    this.addChild( bottomCoilNode.frontImage );
    bottomCoilNode.frontImage.center = model.bottomCoil.position.plus( new Vector2( CoilNode.xOffset, 0 ) );

    topCoilNode.frontImage.detach();
    this.addChild( topCoilNode.frontImage );
    topCoilNode.frontImage.center = model.topCoil.position.plus( new Vector2( CoilNode.xOffset + CoilNode.twoOffset, 0 ) );
    model.showTopCoilProperty.linkAttribute( topCoilNode.frontImage, 'visible' );
  }

  faradaysLaw.register( 'FaradaysLawScreenView', FaradaysLawScreenView );

  return inherit( ScreenView, FaradaysLawScreenView, {

    /**
     * Step in time
     * @param {number} dt - elapsed time in seconds
     */
    step: function( dt ) {
      this.magnetNodeWithField.step( dt );
    }
  } );
} );