// Copyright 2017, University of Colorado Boulder

/**
 * Tests for scene summary descriptions for balloons-and-static-electricity. These descriptions are invisible, but
 * available for screen reader users.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var FaradaysLawModel = require( 'FARADAYS_LAW/faradays-law/model/FaradaysLawModel' );
  // var FaradaysLawScreenView = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawScreenView' );
  var MagnetRegions = require( 'FARADAYS_LAW/faradays-law/view/MagnetRegions' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Util = require( 'DOT/Util' );

  // create model and view
  var model = new FaradaysLawModel( FaradaysLawConstants.LAYOUT_BOUNDS, new Tandem() );
  // var view = new FaradaysLawScreenView( model, new Tandem() );

  var regionTester = new MagnetRegions( model );

  const { test } = QUnit;

  QUnit.module( 'MagnetRegionsTest' );

  const columnWidth = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getWidth() / 3 );
  // const rowHeight = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getHeight() / 3 );

  test( 'get column numbers', assert => {
    let x = columnWidth / 2; // center of col 1
    assert.equal( regionTester.getColumn( x ), 0, `${x} is in column 0`  );

    x += columnWidth;
    assert.equal( regionTester.getColumn( x ), 1, `${x} is in column 1`  );

    x += columnWidth;
    assert.equal( regionTester.getColumn( x ), 2, `${x} is in column 2`  );

    x += columnWidth;
    assert.equal( regionTester.getColumn( x ), 2, `${x} is in column 2`  );

    x = -1; // outside layout bounds -> still col 1
    assert.equal( regionTester.getColumn( x ), 0, `${x} is in column 0` );
  } );
} );