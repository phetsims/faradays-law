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
  const FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  const FaradaysLawModel = require( 'FARADAYS_LAW/faradays-law/model/FaradaysLawModel' );
  // const FaradaysLawScreenView = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawScreenView' );
  const MagnetRegions = require( 'FARADAYS_LAW/faradays-law/view/MagnetRegions' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // create model and view
  const model = new FaradaysLawModel( FaradaysLawConstants.LAYOUT_BOUNDS, new Tandem() );
  // const view = new FaradaysLawScreenView( model, new Tandem() );

  const regionTester = new MagnetRegions( model );

  const { test } = QUnit;

  QUnit.module( 'MagnetRegions' );

  const columnWidth = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getWidth() / 3 );
  const rowHeight = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getHeight() / 3 );

  let x = columnWidth / 2; // center of col 1
  let y = rowHeight / 2; // center of row 1
  let v = new Vector2( x, y );

  test( 'get column numbers', assert => {
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

  test( 'get row numbers', assert => {

    assert.equal( regionTester.getRow( y ), 0, `${y} in row 0` );

    y += rowHeight;
    assert.notEqual( regionTester.getRow( y ), 0, `${y} not in row 0` );
    assert.equal( regionTester.getRow( y ), 1, `${y} in row 1` );

    y += rowHeight;
    assert.equal( regionTester.getRow( y ), 2, `${y} in row 2` );

    y += rowHeight;
    assert.equal( regionTester.getRow( y ), 2, `${y} in row 2` );

    y = 1000;
    assert.equal( regionTester.getRow( y ), 2, `${y} in row 2` );
  } );

  test( 'get region numbers', assert => {
    x = columnWidth / 2;
    y = rowHeight / 2;

    assert.equal( regionTester.getRegion( v ), 0, `point ${x}, ${y} in region 0` );

    v.addXY( columnWidth, 0 );
    assert.equal( regionTester.getRegion( v ), 1, `point ${v.x}, ${v.y} in region 1` );

    v.addXY( columnWidth, 0 );
    assert.equal( regionTester.getRegion( v ), 2, `point ${v.x}, ${v.y} in region 2` );

    v.setXY( x, v.y + rowHeight );
    assert.equal( regionTester.getRegion( v ), 3, `point ${v.x}, ${v.y} in region 3` );

    v.addXY( columnWidth, 0 );
    assert.equal( regionTester.getRegion( v ), 4, `point ${v.x}, ${v.y} in region 4` );

    v.addXY( columnWidth, 0 );
    assert.equal( regionTester.getRegion( v ), 5, `point ${v.x}, ${v.y} in region 5` );

    v.setXY( x, v.y + rowHeight );
    assert.equal( regionTester.getRegion( v ), 6, `point ${v.x}, ${v.y} in region 6`);

    v.addXY( columnWidth, 0 );
    assert.equal( regionTester.getRegion( v ), 7, `point ${v.x}, ${v.y} in region 7` );

    v.addXY( columnWidth, 0 );
    assert.equal( regionTester.getRegion( v ), 8, `point ${v.x}, ${v.y} in region 8` );
  } );

  test( 'get magnet edge notification', assert => {
    const halfMagnetWidth = Util.roundSymmetric( FaradaysLawConstants.MAGNET_WIDTH / 2 );
    const halfMagnetHeight = Util.roundSymmetric( FaradaysLawConstants.MAGNET_HEIGHT / 2 );

    // set position to middle of vertical bounds and left edge
    v.setXY( FaradaysLawConstants.LAYOUT_BOUNDS.minX + halfMagnetWidth, FaradaysLawConstants.LAYOUT_BOUNDS.center.y );
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} is on the edge` );

    v.addXY( 5, 0 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} on edge` );

    v.addXY( 1, 0 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), false, `${v} not on edge` );

    // set position to middle of vertical bounds and left edge
    v.setXY( FaradaysLawConstants.LAYOUT_BOUNDS.maxX - halfMagnetWidth, FaradaysLawConstants.LAYOUT_BOUNDS.center.y );
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} is on the edge` );

    v.addXY( -5, 0 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} on edge` );

    v.addXY( -1, 0 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), false, `${v} not on edge` );

    v.setXY( FaradaysLawConstants.LAYOUT_BOUNDS.center.x, FaradaysLawConstants.LAYOUT_BOUNDS.minY + halfMagnetHeight );
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} is on the edge` );

    v.addXY( 0, 5 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} on edge` );

    v.addXY( 0, 1 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), false, `${v} not on edge` );

    v.setXY( FaradaysLawConstants.LAYOUT_BOUNDS.center.x, FaradaysLawConstants.LAYOUT_BOUNDS.maxY - halfMagnetHeight );
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} is on the edge` );

    v.addXY( 0, -5 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), true, `${v} on edge` );

    v.addXY( 0, -1 ); // edge tolerance is 5, should return false
    assert.equal( regionTester.isVectorAtEdge( v ), false, `${v} not on edge` );
  } );

  test( 'region changed events', assert => {
    const { maxX, maxY } = FaradaysLawConstants.LAYOUT_BOUNDS;
    let eventsFired = 0;
    let testNewRegion = null;
    const testListener = ( newRegion, oldRegion ) => {
      eventsFired++;
      testNewRegion = newRegion;
    };

    regionTester.regionChangedEmitter.addListener( testListener );

    const cycleBounds = ( intersectionPoint ) => {
      model.moveMagnetToPosition( intersectionPoint.plusXY( -5, -5 ) );
      assert.equal( eventsFired, 1, 'region changed fired' );
      model.moveMagnetToPosition( intersectionPoint.plusXY( 5, -5 ) );
      assert.equal( eventsFired, 2, 'region changed fired' );
      model.moveMagnetToPosition( intersectionPoint.plusXY( 5, 5 ) );
      assert.equal( eventsFired, 3, 'region changed fired' );
      model.moveMagnetToPosition( intersectionPoint.plusXY( -5, 5 ) );
      assert.equal( eventsFired, 4, 'region changed fired' );
    };

    let emitTestVector = new Vector2( maxX - columnWidth, maxY - rowHeight );

    cycleBounds( emitTestVector );
    assert.equal( testNewRegion, 7, 'magnet ended at region 7' );
    eventsFired = 0;

    emitTestVector.addXY( -columnWidth, 0 );
    cycleBounds( emitTestVector );
    assert.equal( testNewRegion, 6, 'magnet should end in region 4' );
    eventsFired = 0;

    emitTestVector.addXY( 0, -rowHeight );
    cycleBounds( emitTestVector );
    assert.equal( testNewRegion, 3, 'magnet should end in region 3' );
    eventsFired = 0;

    emitTestVector.addXY( columnWidth, 0 );
    cycleBounds( emitTestVector );
    assert.equal( testNewRegion, 4, 'magnet should end in region 6' );

    regionTester.regionChangedEmitter.removeListener( testListener );
  } );
} );