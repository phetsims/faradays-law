// Copyright 2014-2018, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const JumpMagnitudeArrowNode = require( 'FARADAYS_LAW/faradays-law/view/JumpMagnitudeArrowNode' );
  const KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  const MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );
  const MagnetInteractionCueNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetInteractionCueNode' );
  const MagnetJumpKeyboardListener = require( 'FARADAYS_LAW/faradays-law/view/MagnetJumpKeyboardListener' );
  const MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const barMagnetString = FaradaysLawA11yStrings.barMagnet.value;
  const barMagnetIsString = FaradaysLawA11yStrings.barMagnetIs.value; // The bar magnet is
  const magnetPolarityString = FaradaysLawA11yStrings.magnetPolarity.value;
  const fieldStrengthIsString = FaradaysLawA11yStrings.fieldStrengthIs.value;
  const fieldLinesString = FaradaysLawA11yStrings.fieldLines.value;

  /**
   * @param {FaradaysLawModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  class MagnetNodeWithField extends Node {
    constructor( model, tandem ) {

      super( {
        tagName: 'div',
        labelTagName: 'h3',
        labelContent: barMagnetString
      } );

      var self = this;

      // magnet
      this.magnetNode = createMagnetNode( model.magnet );

      // field lines
      this.addChild( new MagnetFieldLines( model.magnet ) );

      // a11y
      // create the focus highlight to pass as an option
      const draggableNodeFocusHighlight = new FocusHighlightFromNode( this.magnetNode ); // overridden once the draggableNode is fully constructed

      // the draggable container for the magnet and arrows
      const draggableNode = new Node( {
        cursor: 'pointer',

        // The parent (MagnetNodeWithField) isn't instrumented, and this is the interactive node, so instrument this as
        // the "parent" magnet instances, see https://github.com/phetsims/faradays-law/issues/116.
        // NOTE: this assumes that tandem is not passed into a mutate or Node.call() in the MagnetNodeWithField type.
        tandem,
        phetioInstanceDocumentation: 'The draggable container for the magnet and arrows',

        // a11y
        tagName: 'div',
        ariaRole: 'application',
        focusable: true,
        focusHighlightLayerable: true,
        focusHighlight: draggableNodeFocusHighlight
      } );

      this.addChild( draggableNode );
      this.addChild( draggableNodeFocusHighlight );
      draggableNode.addChild( this.magnetNode );

      // magnet reflection - node to indicate the future location when sliding the magnet
      this.reflectedMagnetNode = createMagnetNode( model.magnet );
      this.addChild( this.reflectedMagnetNode );
      this.reflectedMagnetNode.opacity = 0.5;
      this.reflectedMagnetNode.visible = false;

      // help arrows around the magnet
      const magnetInteractionCueNode = new MagnetInteractionCueNode();

      this.addChild( magnetInteractionCueNode );

      // a11y - Update the focusHighlight according to arrow visibility. The dilationCoefficient changes based on the
      // size of the node being highlighted.
      model.showMagnetArrowsProperty.link( showArrows => {
        magnetInteractionCueNode.visible = showArrows;
      } );

      magnetInteractionCueNode.setKeyPositions( this.magnetNode.bounds );

      // handler
      let magnetOffset = new Vector2();
      const dragListener = new DragListener( {

        tandem: tandem.createTandem( 'dragListener' ),
        phetioInstanceDocumentation: 'Emits events when dragged by the user',

        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        start( event ) {
          magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
          magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;
        },

        // Translate on drag events
        drag( event ) {
          model.showMagnetArrowsProperty.set( false );
          const parentPoint = self.globalToParentPoint( event.pointer.point );
          const desiredPosition = parentPoint.minus( magnetOffset );
          model.moveMagnetToPosition( desiredPosition );
        }
      } );
      draggableNode.addInputListener( dragListener );

      // a11y descriptions - generates text content and alerts for magnet interactions
      const describer = new MagnetDescriber( model, tandem );

      // @private - The sticky drag handler for keyboard navigation
      this.keyboardDragListener = new KeyboardDragListener( {
        drag( vectorDelta ) {
          model.showMagnetArrowsProperty.set( false );
          let newPosition = model.magnet.positionProperty.get().plus( vectorDelta );
          newPosition = model.bounds.closestPointTo( newPosition );
          model.moveMagnetToPosition( newPosition );
        },
        dragBounds: model.bounds
      } );

      // arrows displayed before initiating the sliding/jumping movement
      const leftJumpArrows = new JumpMagnitudeArrowNode( 'left' );
      const rightJumpArrows = new JumpMagnitudeArrowNode( 'right' );
      leftJumpArrows.setKeyPositions( this.magnetNode.bounds );
      rightJumpArrows.setKeyPositions( this.magnetNode.bounds );
      this.addChild( leftJumpArrows );
      this.addChild( rightJumpArrows );

      draggableNode.addAccessibleInputListener( this.keyboardDragListener );

      // handle the jump/slide interaction
      const magnetJumpKeyboardListener = new MagnetJumpKeyboardListener( model, {
        onKeydown( event ) {
          if ( KeyboardUtil.isNumberKey( event.keyCode ) && Number( event.key ) <= 3 ) {
            self.reflectedMagnetNode.visible = true;
            model.showMagnetArrowsProperty.set( false );

            const magnitude = Number( event.key );

            if ( model.magnet.positionProperty.get().x <= ( model.bounds.maxX / 2 ) ) {
              // point to right
              rightJumpArrows.showCue( magnitude );
            }
            else {
              leftJumpArrows.showCue( magnitude );
            }
          }
        },
        onKeyup( event ) {
          if ( KeyboardUtil.isNumberKey( event.keyCode ) ) {
            self.reflectedMagnetNode.visible = false;
          }
          rightJumpArrows.hideCue();
          leftJumpArrows.hideCue();
        }
      } );

      draggableNode.addAccessibleInputListener( magnetJumpKeyboardListener );

      // listener to position the reflected node
      const setReflectedNodeCenter = position => {
        this.reflectedMagnetNode.center = this.parentToLocalPoint( position );
      };

      // observers
      model.magnet.orientationProperty.link( () => {
        this.magnetNode.detach();
        this.magnetNode = createMagnetNode( model.magnet );
        draggableNode.addChild( this.magnetNode );

        // ensure poles on the reflected magnet match that of the original
        this.reflectedMagnetNode.detach();
        this.reflectedMagnetNode = createMagnetNode( model.magnet );
        this.addChild( this.reflectedMagnetNode );
        this.reflectedMagnetNode.opacity = 0.5;
        this.reflectedMagnetNode.visible = false;
        setReflectedNodeCenter( magnetJumpKeyboardListener.reflectedPositionProperty.get() );
      } );

      model.magnet.positionProperty.linkAttribute( this, 'translation' );

      magnetJumpKeyboardListener.reflectedPositionProperty.link( setReflectedNodeCenter );

      // magnet and circuit description content, TODO: refactor into separate node(s)?
      const fourCoilOnlyNode = new Node( {
        tagName: 'p'
      } );

      const locationItem = new Node( { tagName: 'li' } );
      const twoCoilProximityItem = new Node( { tagName: 'li' } );
      const fourCoilProximityItem = new Node( { tagName: 'li' } );

      const twoAndFourCoilNode = new Node( {
        tagName: 'ul',
        labelTagName: 'p',
        labelContent: barMagnetIsString,
        children: [ locationItem, fourCoilProximityItem, twoCoilProximityItem ]
      } );

      this.addChild( fourCoilOnlyNode );
      this.addChild( twoAndFourCoilNode );

      const northNode = new Node( { tagName: 'li', innerContent: describer.northPoleSideString } );
      const southNode = new Node( { tagName: 'li', innerContent: describer.southPoleSideString } );

      const polarityNode = new Node(
        {
          tagName: 'ul',
          labelTagName: 'p',
          labelContent: magnetPolarityString,
          children: [ northNode, southNode ]
        }
      );

      this.addChild( polarityNode );

      const fourLoopOnlyStrengthNode = new Node( { tagName: 'p' } );

      const fourLoopFieldStrengthItem = new Node( { tagName: 'li' } );
      const twoLoopFieldStrengthItem = new Node( { tagName: 'li' } );
      const twoLoopStrengthListNode = new Node( {
        tagName: 'ul',
        labelTagName: 'p',
        labelContent: fieldStrengthIsString,
        children: [ fourLoopFieldStrengthItem, twoLoopFieldStrengthItem ]
      } );

      // @public - for setting accessible order in the screen view
      this.fieldLinesDescriptionNode = new Node( {
        labelTagName: 'h3',
        labelContent: fieldLinesString,
        tagName: 'div',
        descriptionTagName: 'p',
        children: [ fourLoopOnlyStrengthNode, twoLoopStrengthListNode ]
      } );

      this.addChild( this.fieldLinesDescriptionNode );

      // position observers
      model.magnet.positionProperty.link( () => {

        // magnet location and coil proximity description content updates
        fourCoilOnlyNode.innerContent = describer.fourLoopOnlyMagnetPosition;
        locationItem.innerContent = describer.positionOfPlayAreaString;
        twoCoilProximityItem.innerContent = describer.theTwoCoilProximityString;
        fourCoilProximityItem.innerContent = describer.theFourCoilProximityString;

        // field strength description content updates
        fourLoopOnlyStrengthNode.innerContent = describer.fourLoopOnlyFieldStrength;
        fourLoopFieldStrengthItem.innerContent = describer.fourLoopFieldStrength;
        twoLoopFieldStrengthItem.innerContent = describer.twoLoopFieldStrength;
      } );

      model.showTopCoilProperty.link( showTopCoil => {
        fourCoilOnlyNode.visible = !showTopCoil;
        twoAndFourCoilNode.visible = showTopCoil;

        // ensure that the parent node is also visible
        fourLoopOnlyStrengthNode.visible = this.fieldLinesDescriptionNode.visible && !showTopCoil;
        twoLoopStrengthListNode.visible = this.fieldLinesDescriptionNode && showTopCoil;
      } );

      model.magnet.orientationProperty.lazyLink( orientation => {

        // N/S orientation change alert
        northNode.innerContent = describer.northPoleSideString;
        southNode.innerContent = describer.southPoleSideString;
        this.fieldLinesDescriptionNode.descriptionContent = describer.fieldLinesDescription;

        utteranceQueue.addToBack( describer.getFlipMagnetAlertText( orientation ) );
      } );

      model.magnet.showFieldLinesProperty.link( showLines => {
        this.fieldLinesDescriptionNode.visible = showLines;
      } );

      // focus/blur alerts
      draggableNode.addAccessibleInputListener( {
        focus() {
          // FaradaysLawAlertManager.magnetFocusAlert( cueVisible );
          utteranceQueue.addToBack( describer.magnetFocusAlertText );
          describer.regionMap.justFocused = true;
        }
      } );

      // @a11y
      magnetJumpKeyboardListener._isAnimatingProperty.lazyLink( isAnimating => {

        // magnet stopped alert
        if ( !isAnimating ) {
          utteranceQueue.addToBack( describer.slidingStoppedText );
        }
      } );
    }
  }

  /**
   * Creates the magnet node
   * @param {Magnet} magnet
   * @returns {MagnetNode}
   */
  const createMagnetNode = magnet => {
    return new MagnetNode( magnet.orientationProperty.get(), {
      width: magnet.width,
      height: magnet.height,
      showArrows: true
    } );
  };

  return faradaysLaw.register( 'MagnetNodeWithField', MagnetNodeWithField );
} );
