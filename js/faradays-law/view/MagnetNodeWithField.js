// Copyright 2014-2020, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import GrabDragInteraction from '../../../../scenery-phet/js/accessibility/GrabDragInteraction.js';
import FocusHighlightFromNode from '../../../../scenery/js/accessibility/FocusHighlightFromNode.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import grabMagnetSound from '../../../sounds/grab-magnet_mp3.js';
import releaseMagnetSound from '../../../sounds/release-magnet_mp3.js';
import faradaysLaw from '../../faradaysLaw.js';
import faradaysLawStrings from '../../faradaysLawStrings.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import FaradaysLawAlertManager from './FaradaysLawAlertManager.js';
import FaradaysLawKeyboardDragListener from './FaradaysLawKeyboardDragListener.js';
import JumpMagnitudeArrowNode from './JumpMagnitudeArrowNode.js';
import MagnetDescriber from './MagnetDescriber.js';
import MagnetDescriptionNode from './MagnetDescriptionNode.js';
import MagnetFieldLines from './MagnetFieldLines.js';
import MagnetInteractionCueNode from './MagnetInteractionCueNode.js';
import MagnetJumpKeyboardListener from './MagnetJumpKeyboardListener.js';
import MagnetMovementArrowsNode from './MagnetMovementArrowsNode.js';
import MagnetNode from './MagnetNode.js';
import MagnetRegionManager from './MagnetRegionManager.js';

// constants
const HALF_MAGNET_WIDTH = FaradaysLawConstants.MAGNET_WIDTH / 2;
const HALF_MAGNET_HEIGHT = FaradaysLawConstants.MAGNET_HEIGHT / 2;
const barMagnetString = faradaysLawStrings.a11y.barMagnet;

/**
 * @param {FaradaysLawModel} model
 * @param {Tandem} tandem
 * @constructor
 */
class MagnetNodeWithField extends Node {
  constructor( model, tandem ) {

    super();

    const self = this;

    // magnet
    this.magnetNode = createMagnetNode( model.magnet );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnet, tandem.createTandem( 'fieldLinesNode' ) ) );

    // pdom
    // create the focus highlight to pass as an option
    const draggableNodeFocusHighlight = new FocusHighlightFromNode( this.magnetNode ); // overridden once the draggableNode is fully constructed

    // the draggable container for the magnet and arrows
    const draggableNode = new Node( {
      cursor: 'pointer',

      // The parent (MagnetNodeWithField) isn't instrumented, and this is the interactive node, so instrument this as
      // the "parent" magnet instances, see https://github.com/phetsims/faradays-law/issues/116.
      // NOTE: this assumes that tandem is not passed into a mutate or Node.call() in the MagnetNodeWithField type.
      tandem: tandem,
      phetioDocumentation: 'The draggable container for the magnet and arrows',

      // pdom
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,
      innerContent: barMagnetString,
      focusHighlightLayerable: true,
      focusHighlight: draggableNodeFocusHighlight
    } );

    this.addChild( draggableNode );
    this.addChild( draggableNodeFocusHighlight );

    // add the magnet to the draggable node
    draggableNode.addChild( this.magnetNode );

    // add the hint that will provide a clue to the user about how the magnet can be moved
    this.addChild( new MagnetMovementArrowsNode(
      new Dimension2( this.magnetNode.width, this.magnetNode.height ),
      model.magnetArrowsVisibleProperty
    ) );

    // magnet reflection - node to indicate the future position when sliding the magnet
    this.reflectedMagnetNode = createMagnetNode( model.magnet );
    this.addChild( this.reflectedMagnetNode );
    this.reflectedMagnetNode.opacity = 0.5;
    this.reflectedMagnetNode.visible = false;

    // node with information about how to move magnet from the keyboard
    const keyboardInteractionCueNode = new MagnetInteractionCueNode();
    keyboardInteractionCueNode.setKeyPositions( this.magnetNode.bounds );

    // pdom descriptions - generates text content and alerts for magnet interactions
    const regionManager = new MagnetRegionManager( model );
    const describer = new MagnetDescriber( model, regionManager, tandem );
    const alertManager = new FaradaysLawAlertManager( describer );

    // sound generation
    // TODO - @Ashton-Morris - please adjust level if needed, see https://github.com/phetsims/faradays-law/issues/182
    const grabMagnetSoundPlayer = new SoundClip( grabMagnetSound, {
      initialOutputLevel: 0.25 // empirically determined
    } );
    // TODO - @Ashton-Morris - please adjust level if needed, see https://github.com/phetsims/faradays-law/issues/182
    soundManager.addSoundGenerator( grabMagnetSoundPlayer );
    const releaseMagnetSoundPlayer = new SoundClip( releaseMagnetSound, {
      initialOutputLevel: 0.25 // empirically determined
    } );
    soundManager.addSoundGenerator( releaseMagnetSoundPlayer );

    // handler
    let magnetOffset = null; // {Vector2|null}
    const dragListener = new DragListener( {

      tandem: tandem.createTandem( 'dragListener' ),
      phetioDocumentation: 'Emits events when dragged by the user',

      // When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start( event ) {
        grabMagnetSoundPlayer.play();
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
        releaseMagnetSoundPlayer.play();
        alertManager.movementEndAlert();
      }
    } );
    draggableNode.addInputListener( dragListener );

    model.magnet.positionProperty.linkAttribute( this, 'translation' );

    // @private - drag handler for keyboard navigation
    const keyboardDragListener = new FaradaysLawKeyboardDragListener( model, regionManager, alertManager );

    // arrows displayed before initiating the sliding/jumping movement
    const leftJumpArrows = new JumpMagnitudeArrowNode( 'left' );
    const rightJumpArrows = new JumpMagnitudeArrowNode( 'right' );
    leftJumpArrows.setKeyPositions( this.magnetNode.bounds );
    rightJumpArrows.setKeyPositions( this.magnetNode.bounds );
    this.addChild( leftJumpArrows );
    this.addChild( rightJumpArrows );

    // handler for jump/slide interactions
    const magnetJumpKeyboardListener = new MagnetJumpKeyboardListener( model, {
      onKeydown( event ) {
        const domEvent = event.domEvent;

        // event.key is the string value of the key pressed, e.g. 'a', '4', 'tab', etc...
        // we want to ensure that we're only listening for the 1,2, and 3 keys
        if ( KeyboardUtils.isNumberKey( domEvent.keyCode ) && Number( domEvent.key ) > 0 && Number( domEvent.key ) <= 3 ) {
          self.reflectedMagnetNode.visible = true;
          model.magnetArrowsVisibleProperty.set( false );

          const magnitude = Number( domEvent.key );

          const dragBoundsMax = model.bounds.erodedXY( HALF_MAGNET_WIDTH, HALF_MAGNET_HEIGHT ).maxX;
          if ( model.magnet.positionProperty.get().x < ( dragBoundsMax / 2 ) ) {
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
        if ( KeyboardUtils.isNumberKey( event.domEvent.keyCode ) ) {
          self.reflectedMagnetNode.visible = false;
        }
        rightJumpArrows.hideCue();
        leftJumpArrows.hideCue();
      }
    } );

    // flag that tracks whether the magnet has been dragged since initial load or since a reset
    let magnetDragged = false;
    model.magnet.positionProperty.lazyLink( () => {
      if ( !model.resetInProgressProperty.value ) {
        magnetDragged = true;
      }
    } );

    // set up keyboard grab/drag interaction
    const grabDragInteraction = new GrabDragInteraction( draggableNode, {
      listenersForDrag: [ keyboardDragListener, magnetJumpKeyboardListener ],
      grabCueOptions: {

        // Position the grab cue above and to the left of the magnet so that it's close but doesn't overlap with the
        // movement cue arrows and doesn't go off the right edge of the sim when strings are long.
        right: -20,
        bottom: -this.magnetNode.height * 0.7
      },
      dragCueNode: keyboardInteractionCueNode,
      onGrab: () => { model.magnetArrowsVisibleProperty.set( false ); },
      successfulDrag: () => magnetDragged,
      tandem: tandem.createTandem( 'grabDragInteraction' )
    } );

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

    const pdomNode = new MagnetDescriptionNode( model, describer );
    this.addChild( pdomNode );

    model.magnet.orientationProperty.lazyLink( orientation => {
      alertManager.flipMagnetAlert( orientation );
    } );

    // @a11y
    magnetJumpKeyboardListener.isAnimatingProperty.link( isAnimating => {
      regionManager.setMagnetIsAnimating( isAnimating );
    } );

    this.regionManager = regionManager;

    // monitor the model for a reset, perform any local resetting that is necessary
    model.resetInProgressProperty.lazyLink( resetInProgress => {
      if ( resetInProgress ) {
        magnetDragged = false;
        grabDragInteraction.reset();
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

faradaysLaw.register( 'MagnetNodeWithField', MagnetNodeWithField );
export default MagnetNodeWithField;