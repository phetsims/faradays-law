// Copyright 2014-2018, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  // var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  var FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var JumpMagnitudeArrowNode = require( 'FARADAYS_LAW/faradays-law/view/JumpMagnitudeArrowNode' );
  var KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var MagnetDescriptions = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriptions' );
  var MagnetJumpKeyboardListener = require( 'FARADAYS_LAW/faradays-law/view/MagnetJumpKeyboardListener' );
  var MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );
  var MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  var MagnetInteractionCueNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetInteractionCueNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  // var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // var Property = require( 'AXON/Property' );

  // strings
  var barMagnetString = FaradaysLawA11yStrings.barMagnet.value;
  var barMagnetIsString = FaradaysLawA11yStrings.barMagnetIs.value; // The bar magnet is
  // var positionOfPlayAreaPatternString = FaradaysLawA11yStrings.positionOfPlayAreaPattern.value;
  // var twoWordsPatternString = FaradaysLawA11yStrings.twoWordsPattern.value;

  /**
   * @param {FaradaysLawModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MagnetNodeWithField( model, tandem ) {
    var self = this;

    Node.call( this, {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: barMagnetString
    } );

    // magnet
    this.magnetNode = createMagnetNode( model.magnet );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnet ) );

    // a11y
    // create the focus highlight to pass as an option
    var draggableNodeFocusHighlight = new FocusHighlightFromNode( this.magnetNode ); // overridden once the draggableNode is fully constructed

    // the draggable container for the magnet and arrows
    var draggableNode = new Node( {
      cursor: 'pointer',
      tandem: tandem.createTandem( 'draggableNode' ),
      phetioInstanceDocumentation: 'The draggable container for the magnet and arrows.',

      // a11y
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,
      focusHighlightLayerable: true,
      focusHighlight: draggableNodeFocusHighlight
    } );

    this.addChild( draggableNode );
    this.addChild( draggableNodeFocusHighlight );
    draggableNode.addChild( self.magnetNode );

    // magnet reflection
    this.reflectedMagnetNode = createMagnetNode( model.magnet );
    this.addChild( self.reflectedMagnetNode );
    this.reflectedMagnetNode.opacity = 0.5;
    this.reflectedMagnetNode.visible = false;

    var magnetInteractionCueNode = new MagnetInteractionCueNode();

    this.addChild( magnetInteractionCueNode );
    // a11y - Update the focusHighlight according to arrow visibility. The dilationCoefficient changes based on the
    // size of the node being highlighted.
    model.showMagnetArrowsProperty.link( function ( showArrows ) {
      magnetInteractionCueNode.visible = showArrows;
    } );

    magnetInteractionCueNode.setKeyPositions( self.magnetNode.bounds );

    // handler
    var magnetOffset = new Vector2();
    var dragHandler = new SimpleDragHandler( {

      tandem: tandem.createTandem( 'dragHandler' ),
      phetioInstanceDocumentation: 'Emits events when dragged by the user.',

      // When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start: function( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;
      },

      end: function() {

        // arrows always are turned invisible when the user stops dragging the magnet
        model.showMagnetArrowsProperty.set( false );
        // var d = model.magnet.positionProperty.get().distance( model.bottomCoil.position );
        // console.log( 'distance to b coil:', d );
      },

      // Translate on drag events
      drag: function( event ) {
        var parentPoint = self.globalToParentPoint( event.pointer.point );
        var desiredPosition = parentPoint.minus( magnetOffset );
        model.moveMagnetToPosition( desiredPosition );
      }
    } );
    draggableNode.addInputListener( dragHandler );

    // @private - The sticky drag handler for keyboard navigation
    this.keyboardDragListener = new KeyboardDragListener( {
      drag: function( vectorDelta ) {
        var newPosition = model.magnet.positionProperty.get().plus( vectorDelta );
        newPosition = model.bounds.closestPointTo( newPosition );
        model.moveMagnetToPosition( newPosition );
      },
      end: function() {
        model.showMagnetArrowsProperty.set( false );
      },
      dragBounds: model.bounds
    } );

    var leftJumpArrows = new JumpMagnitudeArrowNode( 'left' );
    var rightJumpArrows = new JumpMagnitudeArrowNode( 'right' );
    leftJumpArrows.setKeyPositions( self.magnetNode.bounds );
    rightJumpArrows.setKeyPositions( self.magnetNode.bounds );
    this.addChild( leftJumpArrows );
    this.addChild( rightJumpArrows );

    draggableNode.addAccessibleInputListener( this.keyboardDragListener );

    this.magnetJumpKeyboardListener = new MagnetJumpKeyboardListener( model, {
      onKeydown: function( event ) {
        if ( KeyboardUtil.isNumberKey( event.keyCode ) && Number( event.key ) <= 3 ) {
          self.reflectedMagnetNode.visible = true;
          model.showMagnetArrowsProperty.set( false );

          var magnitude = Number( event.key );

          if ( model.magnet.positionProperty.get().x <= (model.bounds.maxX / 2 ) ) {
            // point to right
            rightJumpArrows.showCue( magnitude );
          } else {
            leftJumpArrows.showCue( magnitude );
          }
        }
      },
      onKeyup: function( event ){
        if ( KeyboardUtil.isNumberKey( event.keyCode ) ) {
          self.reflectedMagnetNode.visible = false;
        }
        rightJumpArrows.hideCue();
        leftJumpArrows.hideCue();
      }
    } );

    draggableNode.addAccessibleInputListener( this.magnetJumpKeyboardListener );

    var setReflectedNodeCenter = function( position ) {
      self.reflectedMagnetNode.center = self.parentToLocalPoint( position );
    };

    // observers
    model.magnet.orientationProperty.link( function() {
      self.magnetNode.detach();
      self.magnetNode = createMagnetNode( model.magnet );
      draggableNode.addChild( self.magnetNode );

      self.reflectedMagnetNode.detach();
      self.reflectedMagnetNode = createMagnetNode( model.magnet );
      self.addChild( self.reflectedMagnetNode );
      self.reflectedMagnetNode.opacity = 0.5;
      self.reflectedMagnetNode.visible = false;
      setReflectedNodeCenter( self.magnetJumpKeyboardListener.reflectedPositionProperty.get() );
    } );

    model.magnet.positionProperty.linkAttribute( this, 'translation' );

    this.magnetJumpKeyboardListener.reflectedPositionProperty.link( setReflectedNodeCenter );

    // a11y descriptions
    var describer = new MagnetDescriptions( model );

    // var dynamicChildrenNode = new Node();
    // this.addChild( dynamicChildrenNode );

    var fourCoilOnlyNode = new Node( {
      tagName: 'p'
    } );

    var locationItem = new Node( { tagName: 'li' } );
    var twoCoilProximityItem = new Node( { tagName: 'li' } );
    var fourCoilProximityItem = new Node( { tagName: 'li' } );

    var twoAndFourCoilNode = new Node( {
      tagName: 'ul',
      labelTagName: 'p',
      labelContent: barMagnetIsString,
      children: [ locationItem, fourCoilProximityItem, twoCoilProximityItem  ]
    } );

    this.addChild( fourCoilOnlyNode );
    this.addChild( twoAndFourCoilNode );

    model.magnet.positionProperty.link( function( position ) {
      // get descriptions
      fourCoilOnlyNode.innerContent = describer.fourLoopOnlyMagnetPosition;
      locationItem.innerContent = describer.positionOfPlayAreaString;
      twoCoilProximityItem.innerContent = describer.theTwoCoilProximityString;
      fourCoilProximityItem.innerContent = describer.theFourCoilProximityString;
    } );

    model.showTopCoilProperty.link( function( showTopCoil ) {
      fourCoilOnlyNode.visible = !showTopCoil;
      twoAndFourCoilNode.visible = showTopCoil;
    } );

    // Property.multilink(
    //   [ model.showTopCoilProperty, model.showVoltmeterProperty ],
    //   function( showTopCoil, showVoltmeter ) {
    //     if ( !( showTopCoil || showVoltmeter ) ) {
    //       dynamicChildrenNode.children = [ fourCoilOnlyNode ];
    //     } else {
    //       var children = [];
    //       children.push( fourLoopItem );
    //       showTopCoil && children.push( twoLoopItem );
    //       showVoltmeter && children.push( voltmeterItem );
    //       otherComponentsNode.children = children;
    //       dynamicChildrenNode.children = [ otherComponentsNode ];
    //     }
    //   }
    // );
  }

  /**
   * Creates the magnet node
   * @param {Magnet} magnet
   * @returns {MagnetNode}
   */
  var createMagnetNode = function( magnet ) {
    return new MagnetNode( magnet.orientationProperty.get(), {
      width: magnet.width,
      height: magnet.height,
      showArrows: true
    } );
  };

  faradaysLaw.register( 'MagnetNodeWithField', MagnetNodeWithField );

  return inherit( Node, MagnetNodeWithField, {

    /**
     * Step in time
     * @param {number} dt - elapsed time in seconds
     * @public
     */
    // step: function( dt ) {
    //   this.magnetAccessibleDragHandler.step( dt );
    // }
  } );
} );
