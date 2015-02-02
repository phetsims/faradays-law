// Copyright 2002-2014, University of Colorado Boulder

/**
 * Container for two buttons show one/two coils.
 * 'Faradays Law' simulation.
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var SimpleToggleButton = require( 'FARADAYS_LAW/faradays-law/view/buttons/SimpleToggleButton' );

  /**
   * @param showSecondCoilProperty - boolean property
   * @param options
   * @constructor
   */
  var ShowCoilsButton = function( showSecondCoilProperty, options ) {
    Node.call( this );

    var showTwoCoilsButton = new SimpleToggleButton( showSecondCoilProperty, false, new VBox( {
      children: [
        new CoilNode( CoilTypeEnum.TWO_COIL, { isSmall: true, visible: false } ),
        new CoilNode( CoilTypeEnum.FOUR_COIL, { isSmall: true } )
      ],
      spacing: 10,
      align: 'left'
    } ) );

    var showFourCoilsButton = new SimpleToggleButton( showSecondCoilProperty, true, new VBox( {
      children: [
        new CoilNode( CoilTypeEnum.TWO_COIL, { isSmall: true } ),
        new CoilNode( CoilTypeEnum.FOUR_COIL, { isSmall: true } )
      ],
      spacing: 10,
      align: 'left'
    } ) );

    this.addChild( new HBox( {
      children: [ showTwoCoilsButton, showFourCoilsButton ],
      spacing: 18
    } ) );

    this.mutate( options );
  };

  return inherit( Node, ShowCoilsButton );
} );
