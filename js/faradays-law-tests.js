// Copyright 2018, University of Colorado Boulder

/**
 * Unit tests for balloons-and-static-electricity.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  require( 'SCENERY/util/Trail' ); // Why isn't Trail added to scenery namespace for these tests??
  require( 'FARADAYS_LAW/faradays-law/view/MagnetRegionManagerTests' );

  // Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
  QUnit.start();
} );