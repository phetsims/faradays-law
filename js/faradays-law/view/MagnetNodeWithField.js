// Copyright 2014-2020, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import FocusHighlightFromNode from '../../../../scenery/js/accessibility/FocusHighlightFromNode.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import pickupMagnetJustMetalSound from '../../../sounds/pickup-magnet-just-metal_mp3.js';
import pickupMagnetSound from '../../../sounds/pickup-magnet_mp3.js';
import pickupMagnetFmV1Sound from '../../../sounds/pickup-magnet-fm-v1_mp3.js';
import pickupMagnetFmV2Sound from '../../../sounds/pickup-magnet-fm-v2_mp3.js';
import pickupMagnetFmV3Sound from '../../../sounds/pickup-magnet-fm-v3_mp3.js';
import putDownMagnetSound from '../../../sounds/put-down-magnet_mp3.js';
import putDownMagnetFmV1Sound from '../../../sounds/put-down-magnet-fm-v1_mp3.js';
import putDownMagnetFmV2Sound from '../../../sounds/put-down-magnet-fm-v2_mp3.js';
import putDownMagnetFmV3Sound from '../../../sounds/put-down-magnet-fm-v3_mp3.js';
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
import MagnetNode from './MagnetNode.js';
import MagnetRegionManager from './MagnetRegionManager.js';


// constants
const HALF_MAGNET_WIDTH = FaradaysLawConstants.MAGNET_WIDTH / 2;
const HALF_MAGNET_HEIGHT = FaradaysLawConstants.MAGNET_HEIGHT / 2;
const barMagnetString = faradaysLawStrings.a11y.barMagnet;

// sounds used for pick up and release of the magnet, order must match that of the sound options dialog
const PICK_UP_AND_RELEASE_SOUNDS = [
  {
    pickUp: pickupMagnetJustMetalSound,
    release: putDownMagnetSound
  },
  {
    pickUp: pickupMagnetSound,
    release: putDownMagnetSound
  },
  {
    pickUp: pickupMagnetFmV1Sound,
    release: putDownMagnetFmV1Sound
  },
  {
    pickUp: pickupMagnetFmV2Sound,
    release: putDownMagnetFmV2Sound
  },
  {
    pickUp: pickupMagnetFmV3Sound,
    release: putDownMagnetFmV3Sound
  }
];

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
    draggableNode.addChild( this.magnetNode );

    // magnet reflection - node to indicate the future position when sliding the magnet
    this.reflectedMagnetNode = createMagnetNode( model.magnet );
    this.addChild( this.reflectedMagnetNode );
    this.reflectedMagnetNode.opacity = 0.5;
    this.reflectedMagnetNode.visible = false;

    // help arrows around the magnet
    const magnetInteractionCueNode = new MagnetInteractionCueNode();

    this.addChild( magnetInteractionCueNode );

    // pdom - Update the focusHighlight according to arrow visibility. The dilationCoefficient changes based on the
    // size of the node being highlighted.
    model.magnetArrowsVisibleProperty.link( showArrows => {
      magnetInteractionCueNode.visible = showArrows;
    } );

    magnetInteractionCueNode.setKeyPositions( this.magnetNode.bounds );

    // pdom descriptions - generates text content and alerts for magnet interactions
    const regionManager = new MagnetRegionManager( model );
    const describer = new MagnetDescriber( model, regionManager, tandem );
    const alertManager = new FaradaysLawAlertManager( describer );

    // sound generation
    const pickUpMagnetSoundPlayers = [];
    const releaseMagnetSoundPlayers = [];
    PICK_UP_AND_RELEASE_SOUNDS.forEach( sound => {
      const pickUpSoundClip = new SoundClip( sound.pickUp, { initialOutputLevel: 0.25 } );
      soundManager.addSoundGenerator( pickUpSoundClip );
      pickUpMagnetSoundPlayers.push( pickUpSoundClip );
      const releaseSoundClip = new SoundClip( sound.release, { initialOutputLevel: 0.25 } );
      soundManager.addSoundGenerator( releaseSoundClip );
      releaseMagnetSoundPlayers.push( releaseSoundClip );
    } );

    // sound players that use global configuration information, set via the Options dialog, to decide which sound to play
    const playPickupSound = () => {
      pickUpMagnetSoundPlayers[ phet.faradaysLaw.magnetSoundSetIndexProperty.value ].play();
    };
    const playReleaseSound = () => {
      releaseMagnetSoundPlayers[ phet.faradaysLaw.magnetSoundSetIndexProperty.value ].play();
    };

    // handler
    let magnetOffset = null; // {Vector2|null}
    const dragListener = new DragListener( {

      tandem: tandem.createTandem( 'dragListener' ),
      phetioDocumentation: 'Emits events when dragged by the user',

      // When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start( event ) {
        playPickupSound();
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
        playReleaseSound();
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

    draggableNode.addInputListener( this.keyboardDragListener );

    // add the keyboard & focus event listeners from the alert manager (see AlertManager.js)
    draggableNode.addInputListener( this.keyboardDragListener.initializeAccessibleInputListener() );

    // handle the jump/slide interaction
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

    draggableNode.addInputListener( magnetJumpKeyboardListener );


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