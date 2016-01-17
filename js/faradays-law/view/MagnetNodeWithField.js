// Copyright 2014-2015, University of Colorado Boulder

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
  var MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  var TandemDragHandler = require( 'SCENERY_PHET/input/TandemDragHandler' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );

  // Create single MagnetNode View
  var createMagnetNode = function( magnetModel ) {
    return new MagnetNode( magnetModel.flipped, {
      width: magnetModel.width,
      height: magnetModel.height,
      showArrows: true
    } );
  };

  /**
   *
   * @param model - 'Faradays Law' simulation model
   * @constructor
   */
  function MagnetNodeWithField( model, tandem ) {
    var self = this;
    Node.call( this );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnetModel ) );

    // the draggable container for the magnet and arrows
    var draggableNode = new Node( { cursor: 'pointer' } );
    this.addChild( draggableNode );

    // magnet
    self.magnetNode = createMagnetNode( model.magnetModel );
    draggableNode.addChild( self.magnetNode );

    var magnetArrowOptions = {
      fill: 'hsl(120,90%,85%)',
      tailWidth: 10,
      headWidth: 22,
      headHeight: 18
    };
    var magnetArrowXOffset = 10; // how far the horizontal arrows are from the magnet
    var magnetArrowYOffset = 10; // how far the vertical arrows are from the magent
    var magnetArrowLength = 30;
    var magnetTopArrow = new ArrowNode( this.magnetNode.centerX, this.magnetNode.top - magnetArrowYOffset,
      this.magnetNode.centerX, this.magnetNode.top - magnetArrowLength - magnetArrowYOffset, magnetArrowOptions );
    var magnetBottomArrow = new ArrowNode( this.magnetNode.centerX, this.magnetNode.bottom + magnetArrowYOffset,
      this.magnetNode.centerX, this.magnetNode.bottom + magnetArrowLength + magnetArrowYOffset, magnetArrowOptions );
    var magnetRightArrow = new ArrowNode( this.magnetNode.right + magnetArrowXOffset, this.magnetNode.centerY,
      this.magnetNode.right + magnetArrowLength + magnetArrowXOffset, this.magnetNode.centerY, magnetArrowOptions );
    var magnetLeftArrow = new ArrowNode( this.magnetNode.left - magnetArrowXOffset, this.magnetNode.centerY,
      this.magnetNode.left - magnetArrowLength - magnetArrowXOffset, this.magnetNode.centerY, magnetArrowOptions );
    draggableNode.addChild( magnetTopArrow );
    draggableNode.addChild( magnetBottomArrow );
    draggableNode.addChild( magnetRightArrow );
    draggableNode.addChild( magnetLeftArrow );

    magnetTopArrow.touchArea = magnetTopArrow.localBounds.dilated( 6 );
    magnetBottomArrow.touchArea = magnetBottomArrow.localBounds.dilated( 6 );
    magnetRightArrow.touchArea = magnetRightArrow.localBounds.dilated( 6 );
    magnetLeftArrow.touchArea = magnetLeftArrow.localBounds.dilated( 6 );

    // update the arrow visibility as needed
    var arrowsVisible = model.showMagnetArrowsProperty;
    arrowsVisible.link( function() {
      var visible = arrowsVisible.get();
      magnetTopArrow.visible = visible;
      magnetBottomArrow.visible = visible;
      magnetRightArrow.visible = visible;
      magnetLeftArrow.visible = visible;
    } );

    // handler
    var magnetOffset = {};
    var dragHandler = new TandemDragHandler( {

      tandem: tandem.createTandem( 'dragHandler' ),

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start: function( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;

        // if the user starts the drag on the magnet itself (not on the arrows), we make the arrows invisible
        if ( event.target !== magnetTopArrow && event.target !== magnetBottomArrow && event.target !== magnetRightArrow && event.target !== magnetLeftArrow ) {
          arrowsVisible.set( false );
        }
      },

      end: function() {

        // arrows always are turned invisible when the user stops dragging the magnet
        arrowsVisible.set( false );
      },

      //Translate on drag events
      drag: function( event ) {
        var point = self.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( magnetOffset );
        model.moveMagnetToPosition( desiredPosition );
      }
    } );
    draggableNode.addInputListener( dragHandler );

    // observers
    model.magnetModel.flippedProperty.link( function( flipped ) {
      self.magnetNode.detach();
      self.magnetNode = createMagnetNode( model.magnetModel );
      draggableNode.addChild( self.magnetNode );
    } );

    model.magnetModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );

    // tandem support
    tandem.addInstance( this );
  }

  return inherit( Node, MagnetNodeWithField );
} );