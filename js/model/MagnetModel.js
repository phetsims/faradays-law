// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the magnet in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param x
   * @param y
   * @constructor
   */
  function MagnetModel( x, y, width, height ) {

    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      position: new Vector2( x, y ),
      flipped: true,
      showFieldLines: false
    } );

  }

  return inherit( PropertySet, MagnetModel );
} );