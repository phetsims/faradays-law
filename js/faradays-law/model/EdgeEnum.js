// Copyright 2017-2020, University of Colorado Boulder

/**
 * Possible Edge types in 'Faradays Law' simulation for when a magnet is colliding with a coil during dragging.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import faradaysLaw from '../../faradaysLaw.js';

const EdgeEnum = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};

if ( assert ) { Object.freeze( EdgeEnum ); }

faradaysLaw.register( 'EdgeEnum', EdgeEnum );
export default EdgeEnum;