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
  var CoilNode = require( 'FARADAYS_LAW/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/view/CoilTypeEnum' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var SimpleToggleButton = require( 'FARADAYS_LAW/view/buttons/SimpleToggleButton' );

  //curved arrow shape
  var ShowCoilsButton = function( showSecondCoilProperty, options ) {
    Node.call( this );

    var showTwoCoilsButton = new SimpleToggleButton( showSecondCoilProperty, false, new VBox( {
      children: [
        new CoilNode( CoilTypeEnum.TWO_COIL, {visible: false} ),
        new CoilNode( CoilTypeEnum.FOUR_COIL, {} )
      ],
      spacing: 10,
      align: "left"
    } ) );

    var showFourCoilsButton = new SimpleToggleButton( showSecondCoilProperty, true, new VBox( {
      children: [
        new CoilNode( CoilTypeEnum.TWO_COIL ),
        new CoilNode( CoilTypeEnum.FOUR_COIL, {} )
      ],
      spacing: 10,
      align: "left"
    } ) );

    this.addChild( new HBox( {
      children: [showTwoCoilsButton, showFourCoilsButton],
      spacing: 18
    } ) );

    this.mutate( options );
  };

  return inherit( Node, ShowCoilsButton );
} );