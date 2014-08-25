// Copyright 2002-2014, University of Colorado Boulder

/**
 * Magnet Node, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // strings
  var nString = require( 'string!FARADAYS_LAW/faradays-law.n' );
  var sString = require( 'string!FARADAYS_LAW/faradays-law.s' );

  //constants
  var MAGNET_WIDTH = 140;
  var MAGNET_HEIGHT = 30;
  var PHET_FONT = new PhetFont( 24 );
  var DX = 4; //dx offset for 3d back part
  var DY = 2; //dy offset for 3d back part


  // draw half of magnet
  var drawHalfMagnetNode = function( label, backgroundColor, shadeColor, options ) {
    var node = new Node();

    // front part
    node.addChild( new Rectangle( -MAGNET_WIDTH / 4, -MAGNET_HEIGHT / 2, MAGNET_WIDTH / 2, MAGNET_HEIGHT, {
      fill: backgroundColor
    } ) );

    // label
    node.addChild( new Text( label, {
      centerY: 1,
      centerX: 0,
      font: PHET_FONT,
      fill: 'white'
    } ) );

    node.mutate( options );

    //add 3d looking
    node.addChild( new Path( new Shape()
      .moveTo( -MAGNET_WIDTH / 4, -MAGNET_HEIGHT / 2 )
      .lineTo( -MAGNET_WIDTH / 4 + DX, -MAGNET_HEIGHT / 2 - DY )
      .lineTo( MAGNET_WIDTH / 4 + DX, -MAGNET_HEIGHT / 2 - DY )
      .lineTo( MAGNET_WIDTH / 4 + DX, MAGNET_HEIGHT / 2 - DY )
      .lineTo( MAGNET_WIDTH / 4, MAGNET_HEIGHT / 2 )
      .lineTo( MAGNET_WIDTH / 4, -MAGNET_HEIGHT / 2 )
      .close(), {
      fill: shadeColor
    } ) );

    return node;
  };

  function MagnetNode( magnetModel ) {
    var self = this;
    Node.call( this, {cursor:'pointer'});

    var northPole = drawHalfMagnetNode( nString, '#db1e21', '#a00e10', {
      centerY: 0
    } );

    var southPole = drawHalfMagnetNode( sString, '#354d9a', '#1d2a63', {
      centerY: 0
    } );

    this.addChild( northPole );
    this.addChild( southPole );

    magnetModel.flippedProperty.link( function( flipped ) {
      if ( flipped ) {
        northPole.left = 0;
        southPole.left = -MAGNET_WIDTH / 2;
        northPole.moveToFront();
      }
      else {
        southPole.left = 0;
        northPole.left = -MAGNET_WIDTH / 2;
        southPole.moveToFront();
      }
    } );

    magnetModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );

    var magnetOffset = {};
    var magnetDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
      },
      end: function() {},
      //Translate on drag events
      drag: function( event ) {
        magnetModel.position = self.globalToParentPoint( event.pointer.point ).subtract( magnetOffset );
      }
    } );

    this.addInputListener( magnetDragHandler );
  }

  return inherit( Node, MagnetNode );
} )
;
