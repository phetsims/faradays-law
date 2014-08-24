// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Number} width of Screen
   * @param {Number} height of Screen
   * @constructor
   */
  function FaradaysLawModel( width, height ) {

    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      coilNumber:1, // number of coils - 1 or 2
      showFieldLines: false,
    } );

  }

  return inherit( PropertySet, FaradaysLawModel, {
    step: function(dt) {
    }
  } );
} );