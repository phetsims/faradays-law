// Copyright 2017-2020, University of Colorado Boulder

/**
 * Possible Edge types in 'Faradays Law' simulation for when a magnet is colliding with a coil during dragging.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import faradaysLaw from '../../faradaysLaw.js';

const OrientationEnum = Enumeration.byKeys( [ 'NS', 'SN' ] );

faradaysLaw.register( 'OrientationEnum', OrientationEnum );
export default OrientationEnum;