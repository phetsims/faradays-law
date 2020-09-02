// Copyright 2020, University of Colorado Boulder

/**
 * query parameters supported by this simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import faradaysLaw from '../faradaysLaw.js';

const FaradaysLawQueryParameters = QueryStringMachine.getAll( {

  // When true, the voltage sound differs based on whether or not the voltmeter is visible.  When false, the voltage
  // sound is the same regardless of the voltmeter's visibility.
  // TODO: This was added to support sound design testing and should be removed when that testing is complete, see
  voltmeterVisibilityAffectsSounds: {
    type: 'boolean',
    defaultValue: true
  }
} );

faradaysLaw.register( 'FaradaysLawQueryParameters', FaradaysLawQueryParameters );
export default FaradaysLawQueryParameters;