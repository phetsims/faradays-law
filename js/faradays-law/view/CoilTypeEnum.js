// Copyright 2014-2020, University of Colorado Boulder

/**
 * Possible Coil types in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import faradaysLaw from '../../faradaysLaw.js';

const CoilTypeEnum = {
  TWO_COIL: 'two-coil',
  FOUR_COIL: 'four-coil',
  NO_COIL: 'no coil'
};

if ( assert ) { Object.freeze( CoilTypeEnum ); }

faradaysLaw.register( 'CoilTypeEnum', CoilTypeEnum );
export default CoilTypeEnum;