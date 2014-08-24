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
  var Image = require( 'SCENERY/nodes/Image' );

  function CoilNode( backImage, frontImage, options ) {
    Node.call( this );

    this.backImage = new Image( backImage, {
      centerX: 0,
      centerY: 0
    } );
    this.addChild( this.backImage );

    this.frontImage = new Image( frontImage, {
      centerX: 0,
      centerY: 0
    } );
    this.addChild( this.frontImage );

    this.mutate( options );
  }

  return inherit( Node, CoilNode );
} )
;
