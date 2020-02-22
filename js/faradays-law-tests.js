// Copyright 2018-2019, University of Colorado Boulder

/**
 * Unit tests for balloons-and-static-electricity.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  require( 'SCENERY/util/Trail' ); // Why is Trail not added to scenery namespace for these tests??
  require( 'FARADAYS_LAW/faradays-law/view/MagnetRegionsTests' );

  // Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
  QUnit.start();
} );