// Copyright 2014-2017, University of Colorado Boulder

/**
 * Possible Coil types in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  var CoilTypeEnum = Object.freeze( {
    TWO_COIL: 'two-coil',
    FOUR_COIL: 'four-coil'
  } );

  faradaysLaw.register( 'CoilTypeEnum', CoilTypeEnum );

  return CoilTypeEnum;
} );
