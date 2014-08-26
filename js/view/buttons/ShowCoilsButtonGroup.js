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
  var SimpleToggleButton = require( 'FARADAYS_LAW/view/buttons/SimpleToggleButton' );

  //curved arrow shape
  var ShowCoilsButton = function( showSecondCoilProperty, options ) {
    Node.call( this );

    this.addChild( new SimpleToggleButton( showSecondCoilProperty, new Node() ) );

    this.mutate( options );
  };

  return inherit( Node, ShowCoilsButton );
} );