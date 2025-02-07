// Copyright 2018-2024, University of Colorado Boulder

/**
 * MagnetAutoSlideKeyboardListener is a keyboard listener that implement the "auto-slide" behavior, which is where the
 * user can press keys that will cause the magnet to translate horizontally until it hits an obstacle or the sim bounds.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import MagnetDirectionEnum from '../model/MagnetDirectionEnum.js';
import FaradaysLawAlertManager from './FaradaysLawAlertManager.js';

// constants
const AUTO_SLIDE_KEYS = [ '1', '2', '3' ];
const { LEFT, RIGHT } = MagnetDirectionEnum;
const HALF_MAGNET_WIDTH = FaradaysLawConstants.MAGNET_WIDTH / 2;
const HALF_MAGNET_HEIGHT = FaradaysLawConstants.MAGNET_HEIGHT / 2;

const SLOW_SLIDE_HOTKEY_DATA = new HotkeyData( {
  keyStringProperties: [ new Property( '1' ) ],
  binderName: 'Slow auto-slide',
  repoName: faradaysLaw.name
} );

const MEDIUM_SLIDE_HOTKEY_DATA = new HotkeyData( {
  keyStringProperties: [ new Property( '2' ) ],
  binderName: 'Medium auto-slide',
  repoName: faradaysLaw.name
} );

const FAST_SLIDE_HOTKEY_DATA = new HotkeyData( {
  keyStringProperties: [ new Property( '3' ) ],
  binderName: 'Fast auto-slide',
  repoName: faradaysLaw.name
} );

const SLIDE_HOTKEY_DATA_COLLECTION = [
  SLOW_SLIDE_HOTKEY_DATA,
  MEDIUM_SLIDE_HOTKEY_DATA,
  FAST_SLIDE_HOTKEY_DATA
];

// speeds, all in model coordinates per second
const SLOW = 90; // empirically determined such that the voltmeter doesn't peg when going through bigger coil
const MEDIUM = 300;
const FAST = 500;

// {Map.<string, number>} - map of the auto-slide keys to a speed for each
const KEY_TO_SPEED_MAP = new Map( [
  [ AUTO_SLIDE_KEYS[ 0 ], SLOW ],
  [ AUTO_SLIDE_KEYS[ 1 ], MEDIUM ],
  [ AUTO_SLIDE_KEYS[ 2 ], FAST ]
] );

// function for mapping speed linearly, which is then used to map it to text for a11y
const speedToValueForText = new LinearFunction( 0, FAST, 0, 200, true );

class MagnetAutoSlideKeyboardListenerX extends KeyboardListener {

  /**
   * @param {FaradaysLawModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( SLIDE_HOTKEY_DATA_COLLECTION ),
      blur: () => {
        this.handleFocusLost();
      },

      press: ( event, keysPressed, listener ) => {
        if ( event ) {
          const key = event.key;
          if ( event.type === 'keydown' ) {
            this.handleKeyPressed( key );
            options.onKeyDown( event );
          }
        }
      },
      release: ( event, keysPressed, listener ) => {
        if ( event ) {
          const key = event.key;

          this.handleKeyReleased( key );
          options.onKeyUp( event );
        }
      },

      // client-provided handlers for additional actions on keys up or down
      onKeyDown: _.noop,
      onKeyUp: _.noop
    }, options );

    super( options );

    // @private {Map<string,boolean>} - Map used to track the up/down state for each of the auto-slide keys.
    this.autoSlideKeyIsDownMap = new Map();
    AUTO_SLIDE_KEYS.forEach( key => this.autoSlideKeyIsDownMap.set( key, false ) );

    // @public (read-only) - true when the magnet is being animated (moved) by this object
    this.isAnimatingProperty = new BooleanProperty( false );

    // @public (read-only) - the position where the magnet will head towards if and when this listener is fired
    this.slideTargetPositionProperty = new Vector2Property( Vector2.ZERO );

    // @private - speed at which translation of the magnet should occur
    this.translationSpeed = 0;

    // @private (read-only) {FaradaysLawModel}
    this.model = model;

    // @private (read-only) {Bounds2}
    this._constrainedDragBounds = FaradaysLawConstants.LAYOUT_BOUNDS.erodedXY( HALF_MAGNET_WIDTH, HALF_MAGNET_HEIGHT );

    // To avoid odd behavior, stop any in-progress animations if the number of coils change.
    model.topCoilVisibleProperty.link( () => {
      if ( this.isAnimatingProperty.value ) {
        this.isAnimatingProperty.set( false );
        this.slideTargetPositionProperty.set( model.magnet.positionProperty.value );
      }
    } );

    // Stop any in-progress animation if the user starts dragging the magnet.
    model.magnet.isDraggingProperty.link( isDragging => {
      if ( isDragging ) {
        this.isAnimatingProperty.set( false );
      }
    } );

    // step the listener, must be removed in dispose
    const stepListener = this.step.bind( this );
    stepTimer.addListener( stepListener );

    // @private - called in dispose
    this._disposeMagnetAutoSlideKeyboardListener = () => {
      stepTimer.removeListener( stepListener );
    };
  }

  /**
   * Update the target towards which the magnet with automatically slide based on where it currently is and other model
   * state information.
   * @private
   */
  updateSlideTarget() {

    let preferredDirection;
    if ( this.isAnimatingProperty.value ) {

      // There is an animation in progress, so we want to reverse the direction.
      preferredDirection = this.model.magnet.positionProperty.value.x < this.slideTargetPositionProperty.value.x ?
                           LEFT :
                           RIGHT;
    }
    else {

      // The magnet is not currently sliding, so start it moving.  It will move towards the coils if there is room to
      // do so, otherwise it will move away from them.
      preferredDirection = this.model.magnet.positionProperty.value.x < FaradaysLawConstants.TOP_COIL_POSITION.x ?
                           RIGHT :
                           LEFT;
    }

    // convenience values
    const magnetXPosition = this.model.magnet.positionProperty.value.x;
    const maxXPosition = this._constrainedDragBounds.maxX;
    const minXPosition = this._constrainedDragBounds.minX;

    // Start with a translation that would take the magnet all the way to the right or left model bounds.
    let proposedTranslation = new Vector2(
      preferredDirection === RIGHT ? maxXPosition - magnetXPosition : minXPosition - magnetXPosition,
      0
    );

    // Check whether the proposed translation is viable and, if not, determine what is.
    let allowableTranslation = this.model.checkProposedMagnetMotion( proposedTranslation );

    // If the allowable translation works out to be zero, it means that the magnet is up against an obstacle, so go
    // the other direction.
    if ( allowableTranslation.magnitude === 0 ) {
      preferredDirection = preferredDirection === RIGHT ? LEFT : RIGHT;
      proposedTranslation = new Vector2(
        preferredDirection === RIGHT ? maxXPosition - magnetXPosition : minXPosition - magnetXPosition,
        0
      );
      allowableTranslation = this.model.checkProposedMagnetMotion( proposedTranslation );
    }

    // Set the new target position.
    this.slideTargetPositionProperty.set( this.model.magnet.positionProperty.value.plus( allowableTranslation ) );
  }

  /**
   * Handle one of the monitored keys going down (i.e. being pressed by the user).
   * @private
   * @param {string} key
   */
  handleKeyPressed( key ) {

    if ( KEY_TO_SPEED_MAP.has( key ) ) {

      // Skip the changes if this key is already down.
      if ( !this.autoSlideKeyIsDownMap.get( key ) ) {

        // Mark this key as being down.
        this.autoSlideKeyIsDownMap.set( key, true );

        // Update the slide target.
        this.updateSlideTarget();

        // Initiate the animation.
        this.isAnimatingProperty.set( true );

        // Update the speed at which the magnet will move.
        this.translationSpeed = KEY_TO_SPEED_MAP.get( key );
      }
    }
    else if ( this.isAnimatingProperty.value ) {

      // Any key press that is not one of the auto-slide keys should stop the animation.
      this.isAnimatingProperty.set( false );
    }
  }

  /**
   * Handle one of the keys going up (i.e. being released by the user).
   * @param {string} key
   * @private
   */
  handleKeyReleased( key ) {

    if ( KEY_TO_SPEED_MAP.has( key ) ) {
      this.autoSlideKeyIsDownMap.set( key, false );

      const speedToTextValue = Utils.roundSymmetric( speedToValueForText.evaluate( this.translationSpeed ) );
      const direction = this.model.magnet.positionProperty.value.x < this.slideTargetPositionProperty.value.x ?
                        RIGHT :
                        LEFT;
      FaradaysLawAlertManager.magnetSlidingAlert( speedToTextValue, direction );
    }
  }

  /**
   * Handle the case where the magnet loses a11y focus.
   * Handler for the case where the magnet is released from a11y focus.  If a key is down when the magnet is released,
   * subsequent key up messages won't be received, so we need to clear any keys that are down, see
   * https://github.com/phetsims/faradays-law/issues/214.
   * @private
   */
  handleFocusLost() {

    // Mark all keys as up.
    this.autoSlideKeyIsDownMap.forEach( ( value, key ) => {
      this.autoSlideKeyIsDownMap.set( key, false );
    } );

    // Make sure animation is off.
    this.isAnimatingProperty.set( false );
  }

  /**
   * @public
   * @param {number} dt - in seconds
   */
  step( dt ) {

    // Determine whether any of the auto-slide keys are currently pressed.
    let autoSlideKeyPressed = false;
    for ( const isKeyDown of this.autoSlideKeyIsDownMap.values() ) {
      if ( isKeyDown ) {
        autoSlideKeyPressed = true;
      }
    }

    // If an animation is in progress and none of the auto-slide keys are pressed, move the magnet towards the target.
    if ( this.isAnimatingProperty.value && !autoSlideKeyPressed ) {
      const magnetPosition = this.model.magnet.positionProperty.value;
      if ( !magnetPosition.equals( this.slideTargetPositionProperty.value ) ) {

        const deltaXToTarget = this.slideTargetPositionProperty.value.x - magnetPosition.x;
        let unconstrainedNewPosition;
        if ( Math.abs( deltaXToTarget ) <= dt * this.translationSpeed ) {

          // The magnet is almost to the target position, so just move it there.
          unconstrainedNewPosition = this.slideTargetPositionProperty.value;
        }
        else {
          const distanceSign = deltaXToTarget < 0 ? -1 : 1;
          const deltaVector = new Vector2( distanceSign * this.translationSpeed * dt, 0 );
          unconstrainedNewPosition = magnetPosition.plus( deltaVector );
        }

        // Make sure the new position doesn't put the magnet outside of the drag bounds.
        const constrainedNewPosition = this._constrainedDragBounds.closestPointTo( unconstrainedNewPosition );

        // Move the magnet.
        this.model.moveMagnetToPosition( constrainedNewPosition );
      }

      // If the magnet is now at the destination, clear the animation flag.
      if ( magnetPosition.equals( this.slideTargetPositionProperty.value ) ) {
        this.isAnimatingProperty.set( false );
      }
    }
  }

  /**
   * @public
   */
  dispose() {
    this._disposeMagnetAutoSlideKeyboardListener();
  }

  static SLOW_SLIDE_HOTKEY_DATA = SLOW_SLIDE_HOTKEY_DATA;
  static MEDIUM_SLIDE_HOTKEY_DATA = MEDIUM_SLIDE_HOTKEY_DATA;
  static FAST_SLIDE_HOTKEY_DATA = FAST_SLIDE_HOTKEY_DATA;

  // @public @static
  static isSlideKeyStroke( keyStroke ) {
    return SLIDE_HOTKEY_DATA_COLLECTION.some( hotkeyData => hotkeyData.hasKeyStroke( keyStroke ) );
  }
}

faradaysLaw.register( 'MagnetAutoSlideKeyboardListenerX', MagnetAutoSlideKeyboardListenerX );
export default MagnetAutoSlideKeyboardListenerX;