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
  var MagnetNode = require( 'FARADAYS_LAW/view/MagnetNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function MagnetNodeWithField( magnetModel ) {
    var self = this;
    Node.call( this, {cursor: 'pointer'} );

    magnetModel.flippedProperty.link( function( flipped ) {
      self.removeAllChildren();
      self.addChild( new MagnetNode( flipped ) );
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

  return inherit( Node, MagnetNodeWithField );
} )
;
