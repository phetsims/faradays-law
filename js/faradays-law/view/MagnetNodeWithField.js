// Copyright 2014-2017, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardDragHandler = require( 'SCENERY_PHET/accessibility/KeyboardDragHandler' );
  var MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );
  var MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // Create single MagnetNode View
  var createMagnetNode = function( magnetModel ) {
    return new MagnetNode( magnetModel.flippedProperty.get(), {
      width: magnetModel.width,
      height: magnetModel.height,
      showArrows: true
    } );
  };

  /**
   *
   * @param {FaradaysLawModel} model - 'Faradays Law' simulation model
   * @param {Tandem} tandem
   * @constructor
   */
  function MagnetNodeWithField( model, tandem ) {
    var self = this;
    Node.call( this, {
      tandem: tandem
    } );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnetModel ) );

    // the draggable container for the magnet and arrows
    var draggableNode = new Node( { cursor: 'pointer' } );
    this.addChild( draggableNode );

    // a11y
    draggableNode.tagName = 'div';
    draggableNode.ariaRole = 'application';
    draggableNode.focusable = true;

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
    var magnetArrowYOffset = 10; // how far the vertical arrows are from the magnet
    var magnetArrowLength = 30;
    var magnetTopArrowNode = new ArrowNode( this.magnetNode.centerX, this.magnetNode.top - magnetArrowYOffset,
      this.magnetNode.centerX, this.magnetNode.top - magnetArrowLength - magnetArrowYOffset, _.extend( {
        tandem: tandem.createTandem( 'magnetTopArrowNode' )
      }, magnetArrowOptions ) );
    var magnetBottomArrowNode = new ArrowNode( this.magnetNode.centerX, this.magnetNode.bottom + magnetArrowYOffset,
      this.magnetNode.centerX, this.magnetNode.bottom + magnetArrowLength + magnetArrowYOffset, _.extend( {
        tandem: tandem.createTandem( 'magnetBottomArrowNode' )
      }, magnetArrowOptions ) );
    var magnetRightArrowNode = new ArrowNode( this.magnetNode.right + magnetArrowXOffset, this.magnetNode.centerY,
      this.magnetNode.right + magnetArrowLength + magnetArrowXOffset, this.magnetNode.centerY, _.extend( {
        tandem: tandem.createTandem( 'magnetRightArrowNode' )
      }, magnetArrowOptions ) );
    var magnetLeftArrowNode = new ArrowNode( this.magnetNode.left - magnetArrowXOffset, this.magnetNode.centerY,
      this.magnetNode.left - magnetArrowLength - magnetArrowXOffset, this.magnetNode.centerY, _.extend( {
        tandem: tandem.createTandem( 'magnetLeftArrowNode' )
      }, magnetArrowOptions ) );
    draggableNode.addChild( magnetTopArrowNode );
    draggableNode.addChild( magnetBottomArrowNode );
    draggableNode.addChild( magnetRightArrowNode );
    draggableNode.addChild( magnetLeftArrowNode );

    magnetTopArrowNode.touchArea = magnetTopArrowNode.localBounds.dilated( 6 );
    magnetBottomArrowNode.touchArea = magnetBottomArrowNode.localBounds.dilated( 6 );
    magnetRightArrowNode.touchArea = magnetRightArrowNode.localBounds.dilated( 6 );
    magnetLeftArrowNode.touchArea = magnetLeftArrowNode.localBounds.dilated( 6 );

    // update the arrow visibility as needed
    var arrowsVisible = model.showMagnetArrowsProperty;
    arrowsVisible.link( function() {
      var visible = arrowsVisible.get();
      magnetTopArrowNode.visible = visible;
      magnetBottomArrowNode.visible = visible;
      magnetRightArrowNode.visible = visible;
      magnetLeftArrowNode.visible = visible;
    } );

    // handler
    var magnetOffset = {};
    var dragHandler = new SimpleDragHandler( {

      tandem: tandem.createTandem( 'dragHandler' ),

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start: function( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;

        // if the user starts the drag on the magnet itself (not on the arrows), we make the arrows invisible
        if ( event.target !== magnetTopArrowNode && event.target !== magnetBottomArrowNode && event.target !== magnetRightArrowNode && event.target !== magnetLeftArrowNode ) {
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


    // a11y keyboard drag handler
    this.keyboardDragHandler = new KeyboardDragHandler( model.magnetModel.positionProperty, {

        startDrag: function() {
          arrowsVisible.set( false );
        },
        onDrag: function() {
          model.moveMagnetToPosition( model.magnetModel.positionProperty.get() );
        }
      }
    );
    draggableNode.addAccessibleInputListener( this.keyboardDragHandler );

    // observers
    model.magnetModel.flippedProperty.link( function( flipped ) {
      self.magnetNode.detach();
      self.magnetNode = createMagnetNode( model.magnetModel );
      draggableNode.addChild( self.magnetNode );
    } );

    model.magnetModel.positionProperty.link( function( position ) {
      self.translation = position;
    } );
  }

  faradaysLaw.register( 'MagnetNodeWithField', MagnetNodeWithField );

  return inherit( Node, MagnetNodeWithField, {
    step: function(dt){
      this.keyboardDragHandler.step(dt);
    }
  } );
} );