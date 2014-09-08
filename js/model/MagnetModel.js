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
   * @param x - x position of magnet
   * @param y - y position of magnet
   * @param width - width of magnet
   * @param height - height of magnet
   * @constructor
   */
  function MagnetModel( x, y, width, height ) {

    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      position: new Vector2( x, y ),
      flipped: false, //is magnet flipped
      showFieldLines: false // show field lines for magnet
    } );
  }

  return inherit( PropertySet, MagnetModel );
} );