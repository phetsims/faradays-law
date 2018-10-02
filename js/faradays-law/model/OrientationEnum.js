// Copyright 2017, University of Colorado Boulder

/**
 * Possible Edge types in 'Faradays Law' simulation for when a magnet is colliding with a coil during dragging.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  const OrientationEnum = {
    NS: 'NS',
    SN: 'SN'
  };

  OrientationEnum.values = _.keys( OrientationEnum );
  OrientationEnum.opposite = function( value ) {
    assert && assert( value === OrientationEnum.NS || value === OrientationEnum.SN, 'invalid enum value: ' + value );
    return value === OrientationEnum.NS ? OrientationEnum.SN : OrientationEnum.NS;
  };

  if ( assert ) { Object.freeze( OrientationEnum ); }

  return faradaysLaw.register( 'OrientationEnum', OrientationEnum );
} );