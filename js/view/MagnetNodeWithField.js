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
  var MagnetFieldLines = require( 'FARADAYS_LAW/view/MagnetFieldLines' );

  function MagnetNodeWithField( magnetModel ) {
    var self = this;
    Node.call( this );

    // field lines
    this.addChild( new MagnetFieldLines( magnetModel.flippedProperty ) );

    // magnet
    this.magnetNode = new MagnetNode( magnetModel.flipped );
    this.addChild(this.magnetNode);

    // handler
    var magnetOffset = {};
    var magnetDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;
      },
      end: function() {},
      //Translate on drag events
      drag: function( event ) {
        magnetModel.position = self.globalToParentPoint( event.pointer.point ).subtract( magnetOffset );
      }
    } );

    this.magnetNode.addInputListener( magnetDragHandler );

    // observers
    magnetModel.flippedProperty.link( function( flipped ) {
      self.magnetNode.detach();
      self.magnetNode = new MagnetNode( flipped );
      self.addChild( self.magnetNode );
      self.magnetNode.addInputListener( magnetDragHandler );
    } );

    magnetModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );
  }

  return inherit( Node, MagnetNodeWithField );
} )
;
