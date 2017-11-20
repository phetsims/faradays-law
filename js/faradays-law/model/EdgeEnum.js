// Copyright 2017, University of Colorado Boulder

/**
 * Possible Edge types in 'Faradays Law' simulation for when a magnet is colliding with a coil during dragging.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  var EdgeEnum = Object.freeze( {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
  } );

  faradaysLaw.register( 'EdgeEnum', EdgeEnum );

  return EdgeEnum;
} );
