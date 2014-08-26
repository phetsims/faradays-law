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

  // images
  var bulbImage = require( 'image!FARADAYS_LAW/images/light-bulb.png' );

  function BulbNode( signalProperty, options ) {
    Node.call( this );

    this.bulbImage = new Image( bulbImage, {
      centerX: 0,
      centerY: 0
    } );
    this.addChild( this.bulbImage );

    this.mutate( options );
  }

  return inherit( Node, BulbNode );
} )
;
