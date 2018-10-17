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
  const AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  const FaradaysLawAlertManager = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawAlertManager' );
  const FaradaysLawKeyboardDragListener = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawKeyboardDragListener' );
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const JumpMagnitudeArrowNode = require( 'FARADAYS_LAW/faradays-law/view/JumpMagnitudeArrowNode' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  const MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );
  const MagnetInteractionCueNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetInteractionCueNode' );
  const MagnetJumpKeyboardListener = require( 'FARADAYS_LAW/faradays-law/view/MagnetJumpKeyboardListener' );
  const MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  const MagnetPDOMNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetPDOMNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const MagnetRegionManager = require( 'FARADAYS_LAW/faradays-law/view/MagnetRegionManager' );

  // @a11y strings
  const barMagnetString = FaradaysLawA11yStrings.barMagnet.value;
  const moveInFourDirectionsString = FaradaysLawA11yStrings.moveInFourDirections.value;

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
      this.addChild( new MagnetFieldLines( model.magnet, tandem.createTandem( 'fieldLinesNode' ) ) );

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
        phetioDocumentation: 'The draggable container for the magnet and arrows',

        // a11y
        tagName: 'div',
        ariaRole: 'application',
        focusable: true,
        focusHighlightLayerable: true,
        focusHighlight: draggableNodeFocusHighlight
      } );

      draggableNode.setAccessibleAttribute( 'aria-roledescription', moveInFourDirectionsString );

      draggableNode.addAriaLabelledbyAssociation( {
        otherNode: this,
        thisElementName: AccessiblePeer.PRIMARY_SIBLING,
        otherElementName: AccessiblePeer.LABEL_SIBLING
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
      model.magnetArrowsVisibleProperty.link( showArrows => {
        magnetInteractionCueNode.visible = showArrows;
      } );

      magnetInteractionCueNode.setKeyPositions( this.magnetNode.bounds );

      // a11y descriptions - generates text content and alerts for magnet interactions
      const regionManager = new MagnetRegionManager( model );
      const describer = new MagnetDescriber( model, regionManager, tandem );
      const alertManager = new FaradaysLawAlertManager( describer );

      // handler
      let magnetOffset = null; // {Vector2|null}
      const dragListener = new DragListener( {

        tandem: tandem.createTandem( 'dragListener' ),
        phetioDocumentation: 'Emits events when dragged by the user',

        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        start( event ) {
          magnetOffset = self.globalToParentPoint( event.pointer.point ).minus( self.translation );
        },

        // Translate on drag events
        drag( event ) {
          model.magnetArrowsVisibleProperty.set( false );
          const parentPoint = self.globalToParentPoint( event.pointer.point );
          const desiredPosition = parentPoint.minus( magnetOffset );
          model.moveMagnetToPosition( desiredPosition );
        },

        end( event ) {
          alertManager.movementEndAlert();
        }
      } );
      draggableNode.addInputListener( dragListener );

      model.magnet.positionProperty.linkAttribute( this, 'translation' );


      // @private - The sticky drag handler for keyboard navigation
      this.keyboardDragListener = new FaradaysLawKeyboardDragListener( model, regionManager, alertManager );

      // arrows displayed before initiating the sliding/jumping movement
      const leftJumpArrows = new JumpMagnitudeArrowNode( 'left' );
      const rightJumpArrows = new JumpMagnitudeArrowNode( 'right' );
      leftJumpArrows.setKeyPositions( this.magnetNode.bounds );
      rightJumpArrows.setKeyPositions( this.magnetNode.bounds );
      this.addChild( leftJumpArrows );
      this.addChild( rightJumpArrows );

      draggableNode.addAccessibleInputListener( this.keyboardDragListener );

      // add the keyboard & focus event listeners from the alert manager (see AlertManager.js)
      draggableNode.addAccessibleInputListener( this.keyboardDragListener.initializeAccessibleInputListener() );

      // handle the jump/slide interaction
      const magnetJumpKeyboardListener = new MagnetJumpKeyboardListener( model, {
        onKeydown( event ) {
          // event.key is the string value of the key pressed, e.g. 'a', '4', 'tab', etc...
          // we want to ensure that we're only listening for the 1,2, and 3 keys
          if ( KeyboardUtil.isNumberKey( event.keyCode ) && Number( event.key ) > 0 && Number( event.key ) <= 3 ) {
            self.reflectedMagnetNode.visible = true;
            model.magnetArrowsVisibleProperty.set( false );

            const magnitude = Number( event.key );

            if ( model.magnet.positionProperty.get().x <= ( model.bounds.maxX / 2 ) ) {
              // point to right
              rightJumpArrows.showCue( magnitude );
            }
            else {
              leftJumpArrows.showCue( magnitude );
            }
          }

          if ( magnetJumpKeyboardListener.isAnimatingProperty.get() ) {
            regionManager.stopMagnetAnimationWithKeyboard();
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

      magnetJumpKeyboardListener.reflectedPositionProperty.link( setReflectedNodeCenter );

      const pdomNode = new MagnetPDOMNode( model, describer );
      this.addChild( pdomNode );

      model.magnet.orientationProperty.lazyLink( orientation => {
        alertManager.flipMagnetAlert( orientation );
      } );

      // @a11y
      magnetJumpKeyboardListener.isAnimatingProperty.link( isAnimating => {
        regionManager.setMagnetIsAnimating( isAnimating );
      } );

      this.regionManager = regionManager;
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
