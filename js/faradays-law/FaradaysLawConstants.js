// Copyright 2014-2016, University of Colorado Boulder

/**
 * Constants used throughout the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  var FaradaysLawConstants = {
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 834, 504 ) // TODO: These should be adjusted to the new convention.
  };

  faradaysLaw.register( 'FaradaysLawConstants', FaradaysLawConstants );

  return FaradaysLawConstants;
} );
