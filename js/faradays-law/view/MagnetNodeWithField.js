// Copyright 2014-2017, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardDragHandler = require( 'SCENERY_PHET/accessibility/KeyboardDragHandler' );
  var MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );
  var MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // constants
  var MAGNET_ARROW_OPTIONS = {
    fill: 'hsl(120,90%,85%)',
    tailWidth: 10,
    headWidth: 22,
    headHeight: 18
  };
  var MAGNET_ARROW_OFFSET = 10; // how far arrows are from the magnet (for both horizontal and vertical)
  var MAGNET_ARROW_LENGTH = 30;

  /**
   * @param {FaradaysLawModel} model - 'Faradays Law' simulation model
   * @param {Tandem} tandem - this node is not instrumented but the input listener is
   * @constructor
   */
  function MagnetNodeWithField( model, tandem ) {
    var self = this;
    Node.call( this );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnet ) );

    // the draggable container for the magnet and arrows
    var draggableNode = new Node( { cursor: 'pointer' } );
    this.addChild( draggableNode );

    // magnet
    self.magnetNode = createMagnetNode( model.magnet );
    draggableNode.addChild( self.magnetNode );

    // a11y
    draggableNode.tagName = 'div';
    draggableNode.ariaRole = 'application';
    draggableNode.focusable = true;
    draggableNode.focusHighlightLayerable = true;
    var draggableNodeFocusHighlight = new FocusHighlightPath( new Shape() ); // overridden once the draggableNode is fully constructed
    draggableNode.focusHighlight = draggableNodeFocusHighlight;
    this.addChild( draggableNodeFocusHighlight );

    var createArrowNode = function( tailX, tailY, tipX, tipY ) {
      var arrowNode = new ArrowNode( tailX, tailY, tipX, tipY, MAGNET_ARROW_OPTIONS );
      arrowNode.touchArea = arrowNode.localBounds.dilated( 6 );
      model.showMagnetArrowsProperty.linkAttribute( arrowNode, 'visible' );
      return arrowNode;
    };
    var magnetTopArrowNode = createArrowNode(
      this.magnetNode.centerX, this.magnetNode.top - MAGNET_ARROW_OFFSET,
      this.magnetNode.centerX, this.magnetNode.top - MAGNET_ARROW_LENGTH - MAGNET_ARROW_OFFSET
    );
    var magnetBottomArrowNode = createArrowNode(
      this.magnetNode.centerX, this.magnetNode.bottom + MAGNET_ARROW_OFFSET,
      this.magnetNode.centerX, this.magnetNode.bottom + MAGNET_ARROW_LENGTH + MAGNET_ARROW_OFFSET
    );
    var magnetRightArrowNode = createArrowNode(
      this.magnetNode.right + MAGNET_ARROW_OFFSET, this.magnetNode.centerY,
      this.magnetNode.right + MAGNET_ARROW_LENGTH + MAGNET_ARROW_OFFSET, this.magnetNode.centerY
    );
    var magnetLeftArrowNode = createArrowNode(
      this.magnetNode.left - MAGNET_ARROW_OFFSET, this.magnetNode.centerY,
      this.magnetNode.left - MAGNET_ARROW_LENGTH - MAGNET_ARROW_OFFSET, this.magnetNode.centerY
    );

    // Show all arrows in a dedicated Node so it can be controlled via PhET-iO
    draggableNode.addChild( new Node( {
      children: [
        magnetTopArrowNode,
        magnetBottomArrowNode,
        magnetRightArrowNode,
        magnetLeftArrowNode
      ]
    } ) );

    // Update the focusHighlight according to arrow visibility
    model.showMagnetArrowsProperty.link( function( showMagnetArrows ) {
      var newHighlightShape = showMagnetArrows ? Shape.bounds( draggableNode.bounds ) : Shape.bounds( self.magnetNode.bounds.dilated( 7 ) );
      draggableNodeFocusHighlight.setShape( newHighlightShape );
    } );

    // Set the highlight to the bounds of the draggable node now that all children are added
    draggableNodeFocusHighlight.setShape( Shape.bounds( draggableNode.bounds ) );

    // handler
    var magnetOffset = {}; // TODO: should be a Vector2
    var dragHandler = new SimpleDragHandler( {

      tandem: tandem.createTandem( 'dragHandler' ),

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start: function( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;

        // if the user starts the drag on the magnet itself (not on the arrows), we make the arrows invisible
        if ( event.target !== magnetTopArrowNode && event.target !== magnetBottomArrowNode && event.target !== magnetRightArrowNode && event.target !== magnetLeftArrowNode ) {
          model.showMagnetArrowsProperty.set( false );
        }
      },

      end: function() {

        // arrows always are turned invisible when the user stops dragging the magnet
        model.showMagnetArrowsProperty.set( false );
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
    this.keyboardDragHandler = new KeyboardDragHandler( model.magnet.positionProperty, {

        startDrag: function() {
          model.showMagnetArrowsProperty.set( false );
        },
        onDrag: function() {
          model.moveMagnetToPosition( model.magnet.positionProperty.get() );
        }
      }
    );
    draggableNode.addAccessibleInputListener( this.keyboardDragHandler );

    // observers
    model.magnet.flippedProperty.link( function() {
      self.magnetNode.detach();
      self.magnetNode = createMagnetNode( model.magnet );
      draggableNode.addChild( self.magnetNode );
    } );

    model.magnet.positionProperty.link( function( position ) {
      self.translation = position;
    } );
  }

  // Create single MagnetNode View
  var createMagnetNode = function( magnet ) {
    return new MagnetNode( magnet.flippedProperty.get(), {
      width: magnet.width,
      height: magnet.height,
      showArrows: true
    } );
  };

  faradaysLaw.register( 'MagnetNodeWithField', MagnetNodeWithField );

  return inherit( Node, MagnetNodeWithField, {
    step: function( dt ) {
      this.keyboardDragHandler.step( dt );
    }
  } );
} );