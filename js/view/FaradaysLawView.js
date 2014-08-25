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

  // images
  var twoLoopBack = require( 'image!FARADAYS_LAW/images/two-loop-back.png' );
  var twoLoopFront = require( 'image!FARADAYS_LAW/images/two-loop-front.png' );
  var fourLoopBack = require( 'image!FARADAYS_LAW/images/four-loop-back.png' );
  var fourLoopFront = require( 'image!FARADAYS_LAW/images/four-loop-front.png' );

  /**
   * @param {gameModel} model - Faradays law simulation model object
   * @constructor
   */
  function FaradaysLawView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var coil1Node = new CoilNode( fourLoopBack, fourLoopFront, {
      x: model.coil1.position.x,
      y: model.coil1.position.y
    } );
    this.addChild(coil1Node);

    var coil2Node = new CoilNode( twoLoopBack, twoLoopFront, {
      x: model.coil2.position.x,
      y: model.coil2.position.y
    } );
    this.addChild(coil2Node);


  }

  return inherit( ScreenView, FaradaysLawView, {
  } );
} )
;
