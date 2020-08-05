// Copyright 2014-2020, University of Colorado Boulder

/**
 * Possible Coil types in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import faradaysLaw from '../../faradaysLaw.js';

const CoilTypeEnum = Enumeration.byKeys( [ 'TWO_COIL', 'FOUR_COIL', 'NO_COIL' ] );

faradaysLaw.register( 'CoilTypeEnum', CoilTypeEnum );
export default CoilTypeEnum;