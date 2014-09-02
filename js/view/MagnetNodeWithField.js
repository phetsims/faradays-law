// Copyright 2002-2014, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
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

  /**
   *
   * @param model - 'Faradays Law' simulation model
   * @constructor
   */
  function MagnetNodeWithField( model ) {
    var self = this;
    Node.call( this );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnetModel ) );

    // magnet
    this.magnetNode = new MagnetNode( model.magnetModel.flipped, {
      width: model.magnetModel.width,
      height: model.magnetModel.height
    } );
    this.addChild( this.magnetNode );

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
        var point = self.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( magnetOffset );
        if ( model.possiblePositionForMagnet( desiredPosition ) ) {
          model.magnetModel.position = desiredPosition;
        }
        else {
          magnetOffset.x = point.x - self.centerX;
          magnetOffset.y = point.y - self.centerY;

        }
      }
    } );
    this.magnetNode.addInputListener( magnetDragHandler );

    // observers
    model.magnetModel.flippedProperty.link( function( flipped ) {
      self.magnetNode.detach();
      self.magnetNode = new MagnetNode( model.magnetModel.flipped, {
        width: model.magnetModel.width,
        height: model.magnetModel.height
      } );
      self.addChild( self.magnetNode );
      self.magnetNode.addInputListener( magnetDragHandler );
    } );

    model.magnetModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );
  }

  return inherit( Node, MagnetNodeWithField );
} )
;
