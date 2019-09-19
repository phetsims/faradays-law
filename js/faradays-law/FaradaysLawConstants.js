// Copyright 2014-2018, University of Colorado Boulder

/**
 * Constants used throughout the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  var BULB_POSITION = new Vector2( 190, 244 );

  var FaradaysLawConstants = {
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 834, 504 ),
    BULB_POSITION: BULB_POSITION,
    VOLTMETER_POSITION: BULB_POSITION.minusXY( 0, 165 ),
    MAGNET_HEIGHT: 30,
    MAGNET_WIDTH: 140,
    TOP_COIL_POSITION: new Vector2( 422, 131 ),
    BOTTOM_COIL_POSITION: new Vector2( 448, 328 )
  };

  faradaysLaw.register( 'FaradaysLawConstants', FaradaysLawConstants );

  return FaradaysLawConstants;
} );
