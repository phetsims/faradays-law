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

  var OrientationEnum = {
    NS: 'NS',
    SN: 'SN'
  };

  faradaysLaw.register( 'OrientationEnum', OrientationEnum );

  OrientationEnum.values = _.keys( OrientationEnum );
  OrientationEnum.opposite = function( value ) {
    assert && assert( value === OrientationEnum.NS || value === OrientationEnum.SN, 'invalid enum value: ' + value );
    return value === OrientationEnum.NS ? OrientationEnum.SN : OrientationEnum.NS;
  };

  Object.freeze( OrientationEnum );

  return OrientationEnum;
} );