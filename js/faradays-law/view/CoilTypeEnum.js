// Copyright 2014-2018, University of Colorado Boulder

/**
 * Possible Coil types in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  const CoilTypeEnum = {
    TWO_COIL: 'two-coil',
    FOUR_COIL: 'four-coil',
    NO_COIL: 'no coil'
  };

  if ( assert ) { Object.freeze( CoilTypeEnum ); }

  return faradaysLaw.register( 'CoilTypeEnum', CoilTypeEnum );
} );